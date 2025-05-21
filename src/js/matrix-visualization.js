/**
 * matrix-visualization.js - D3.js implementation of the MITRE D3FEND Matrix visualization
 * 
 * This file contains the core logic for rendering the D3FEND Matrix using D3.js.
 * It handles the matrix layout, technique rendering, filtering, and selection interactions.
 */

// D3FEND Matrix Visualization class
class D3FendMatrixViz {
    constructor(containerId, data) {
        this.container = d3.select(`#${containerId}`);
        this.tactics = data.tactics;
        this.techniques = data.techniques;
        this.selectedTechnique = null;
        this.showAttackMappings = false;
        this.filter = {
            tactic: 'all',
            search: ''
        };
    }

    // Initialize the visualization
    init() {
        // Clear any existing content
        this.container.html('');
        
        // Create the matrix container
        this.matrixContainer = this.container
            .append('div')
            .attr('class', 'matrix-container')
            .style('display', 'flex')
            .style('overflow-x', 'auto');
        
        // Render the matrix
        this.renderMatrix();
        
        // Add event listeners for filters
        this.setupEventListeners();
        
        return this;
    }

    // Render the D3FEND Matrix
    renderMatrix() {
        // Filter techniques based on current filter settings
        const filteredTechniques = this.filterTechniques();
        
        // Group techniques by tactic
        const techniquesByTactic = this.groupTechniquesByTactic(filteredTechniques);
        
        // For each tactic, create a column
        this.tactics.forEach(tactic => {
            // Skip tactics with no techniques after filtering
            if (!techniquesByTactic[tactic.id] || techniquesByTactic[tactic.id].length === 0) {
                return;
            }
            
            // Create column for this tactic
            const column = this.matrixContainer
                .append('div')
                .attr('class', `matrix-column tactic-${tactic.id}`)
                .attr('data-tactic', tactic.id);
            
            // Add tactic header
            column.append('div')
                .attr('class', 'matrix-header')
                .text(tactic.name);
            
            // Create container for techniques
            const techniquesContainer = column
                .append('div')
                .attr('class', 'matrix-techniques');
            
            // Add each technique for this tactic
            techniquesByTactic[tactic.id].forEach(technique => {
                const techniqueItem = techniquesContainer
                    .append('div')
                    .attr('class', 'technique-item')
                    .attr('data-technique-id', technique.id)
                    .on('click', () => this.selectTechnique(technique));
                
                techniqueItem.append('span')
                    .attr('class', 'technique-id')
                    .text(technique.id);
                
                techniqueItem.append('span')
                    .attr('class', 'technique-name')
                    .text(technique.name);
            });
        });
    }

    // Filter techniques based on current filter settings
    filterTechniques() {
        let filtered = [...this.techniques];
        
        // Filter by tactic if not "all"
        if (this.filter.tactic !== 'all') {
            filtered = filtered.filter(technique => technique.tactic === this.filter.tactic);
        }
        
        // Filter by search term if not empty
        if (this.filter.search) {
            const searchTerm = this.filter.search.toLowerCase();
            filtered = filtered.filter(technique => 
                technique.id.toLowerCase().includes(searchTerm) || 
                technique.name.toLowerCase().includes(searchTerm)
            );
        }
        
        return filtered;
    }

    // Group techniques by tactic
    groupTechniquesByTactic(techniques) {
        return techniques.reduce((acc, technique) => {
            if (!acc[technique.tactic]) {
                acc[technique.tactic] = [];
            }
            acc[technique.tactic].push(technique);
            return acc;
        }, {});
    }

    // Select a technique and update the UI
    selectTechnique(technique) {
        this.selectedTechnique = technique;
        
        // Update selection highlighting
        this.container.selectAll('.technique-item')
            .classed('technique-selected', false);
        
        this.container.selectAll(`.technique-item[data-technique-id="${technique.id}"]`)
            .classed('technique-selected', true);
        
        // Update technique details panel
        this.updateTechniqueDetails();
        
        // If showing ATT&CK mappings, update those as well
        if (this.showAttackMappings) {
            this.updateAttackMappings();
        }
        
        // Trigger custom event for other components to react
        const event = new CustomEvent('techniqueSelected', { detail: technique });
        document.dispatchEvent(event);
    }

    // Update the technique details panel with selected technique info
    updateTechniqueDetails() {
        const detailsPanel = d3.select('#technique-details');
        
        if (!this.selectedTechnique) {
            detailsPanel.html('<p>Select a technique from the matrix to view details.</p>');
            return;
        }
        
        let html = `
            <h4>${this.selectedTechnique.id}: ${this.selectedTechnique.name}</h4>
            <p><strong>Tactic:</strong> ${this.getTacticName(this.selectedTechnique.tactic)}</p>
            <p>${this.selectedTechnique.description}</p>
            <h5>Related Digital Artifacts:</h5>
            <ul>
        `;
        
        // Add digital artifacts
        if (this.selectedTechnique.digitalArtifacts && this.selectedTechnique.digitalArtifacts.length > 0) {
            this.selectedTechnique.digitalArtifacts.forEach(artifact => {
                html += `<li>${artifact}</li>`;
            });
        } else {
            html += '<li>No digital artifacts defined.</li>';
        }
        
        html += '</ul>';
        
        // If showing ATT&CK mappings, add those details
        if (this.showAttackMappings) {
            html += this.getAttackMappingsHTML();
        }
        
        detailsPanel.html(html);
    }

    // Get the tactic name from its ID
    getTacticName(tacticId) {
        const tactic = this.tactics.find(t => t.id === tacticId);
        return tactic ? tactic.name : tacticId;
    }

    // Get HTML for ATT&CK mappings
    getAttackMappingsHTML() {
        // Find mappings for the selected technique
        const relatedMappings = ATTACK_TO_D3FEND_MAPPINGS.filter(mapping => 
            mapping.d3fendTechniques.includes(this.selectedTechnique.id)
        );
        
        if (relatedMappings.length === 0) {
            return '<h5>ATT&CK Mappings:</h5><p>No ATT&CK mappings found for this technique.</p>';
        }
        
        let html = '<h5>ATT&CK Mappings:</h5><ul>';
        
        relatedMappings.forEach(mapping => {
            html += `<li><strong>${mapping.attackId}:</strong> ${mapping.attackName}</li>`;
        });
        
        html += '</ul>';
        
        return html;
    }

    // Update the view when ATT&CK mappings setting changes
    updateAttackMappings() {
        if (this.selectedTechnique) {
            this.updateTechniqueDetails();
        }
    }

    // Set up event listeners for filtering
    setupEventListeners() {
        // Tactic filter
        d3.select('#tacticFilter').on('change', (event) => {
            this.filter.tactic = event.target.value;
            this.refresh();
        });
        
        // Search filter
        d3.select('#searchTechnique').on('input', (event) => {
            this.filter.search = event.target.value;
            this.refresh();
        });
        
        // ATT&CK mappings toggle
        d3.select('#showAttackMappings').on('change', (event) => {
            this.showAttackMappings = event.target.checked;
            if (this.selectedTechnique) {
                this.updateTechniqueDetails();
            }
        });
        
        // Export button
        d3.select('#exportBtn').on('click', () => this.exportCurrentView());
    }

    // Refresh the visualization (typically after filter changes)
    refresh() {
        // Clear the container
        this.matrixContainer.html('');
        
        // Render the matrix again with new filters
        this.renderMatrix();
        
        // If there was a selected technique, try to reselect it if still visible
        if (this.selectedTechnique) {
            const stillVisible = this.filterTechniques().some(t => t.id === this.selectedTechnique.id);
            
            if (stillVisible) {
                // Find the DOM element and reselect
                const techniqueItems = this.container.selectAll(`.technique-item[data-technique-id="${this.selectedTechnique.id}"]`);
                
                if (!techniqueItems.empty()) {
                    techniqueItems.classed('technique-selected', true);
                    this.updateTechniqueDetails();
                } else {
                    // Technique is no longer in the DOM, clear selection
                    this.selectedTechnique = null;
                    d3.select('#technique-details').html('<p>Select a technique from the matrix to view details.</p>');
                }
            } else {
                // Technique filtered out, clear selection
                this.selectedTechnique = null;
                d3.select('#technique-details').html('<p>Selected technique is no longer visible with current filters.</p>');
            }
        }
    }

    // Export the current view (CSV format)
    exportCurrentView() {
        const filteredTechniques = this.filterTechniques();
        
        // Create CSV content
        let csv = 'ID,Name,Tactic,Description\n';
        
        filteredTechniques.forEach(technique => {
            // Escape any commas in text fields
            const escapedName = `"${technique.name.replace(/"/g, '""')}"`;
            const escapedDescription = `"${technique.description.replace(/"/g, '""')}"`;
            
            csv += `${technique.id},${escapedName},${this.getTacticName(technique.tactic)},${escapedDescription}\n`;
        });
        
        // Create download link
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'd3fend_matrix_export.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}
