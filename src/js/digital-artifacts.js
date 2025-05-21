/**
 * digital-artifacts.js - D3.js implementation of the Digital Artifacts bridge visualization
 * 
 * This file contains the logic for rendering the Digital Artifacts bridge between
 * ATT&CK techniques and D3FEND countermeasures using D3.js force-directed graph.
 */

// Digital Artifacts Visualization class
class DigitalArtifactsViz {
    constructor(containerId, data) {
        this.container = d3.select(`#${containerId}`);
        this.digitalArtifacts = data.digitalArtifacts;
        this.attackMappings = data.attackMappings;
        this.d3fendTechniques = data.d3fendTechniques;
        this.selectedTechnique = null;
        this.width = this.container.node().getBoundingClientRect().width;
        this.height = 400;
    }

    // Initialize the visualization
    init() {
        // Clear any existing content
        this.container.html('');
        
        // Create SVG container
        this.svg = this.container
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('class', 'digital-artifacts-svg');
        
        // Create tooltip div
        this.tooltip = d3.select('body')
            .append('div')
            .attr('class', 'd3-tooltip')
            .style('opacity', 0);
        
        // Initialize the graph data structures
        this.initGraphData();
        
        // Set up force simulation
        this.simulation = d3.forceSimulation(this.nodes)
            .force('link', d3.forceLink(this.links).id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(this.width / 2, this.height / 2))
            .force('collision', d3.forceCollide().radius(50))
            .on('tick', () => this.ticked());
        
        // Create the initial visualization
        this.createVisualization();
        
        // Set up event listeners
        this.setupEventListeners();
        
        return this;
    }

    // Initialize graph data structures for nodes and links
    initGraphData() {
        this.nodes = [];
        this.links = [];
        
        // Initially, show a simplified version with a few key artifacts
        // This will be updated when specific techniques are selected
        
        // Add the central artifact nodes
        this.digitalArtifacts.forEach(artifact => {
            this.nodes.push({
                id: artifact.id,
                name: artifact.name,
                type: 'artifact',
                description: artifact.description
            });
        });
        
        // Add a sample of technique nodes (both ATT&CK and D3FEND)
        // We'll add more connections dynamically when a technique is selected
        const sampleAttackTechniques = this.attackMappings.slice(0, 3);
        const sampleD3fendTechniques = this.d3fendTechniques.slice(0, 3);
        
        // Add ATT&CK techniques
        sampleAttackTechniques.forEach(mapping => {
            this.nodes.push({
                id: mapping.attackId,
                name: mapping.attackName,
                type: 'attack',
                description: `ATT&CK Technique: ${mapping.attackName}`
            });
            
            // Connect to digital artifacts
            mapping.digitalArtifacts.forEach(artifactId => {
                this.links.push({
                    source: mapping.attackId,
                    target: artifactId,
                    type: 'attack-to-artifact'
                });
            });
        });
        
        // Add D3FEND techniques
        sampleD3fendTechniques.forEach(technique => {
            this.nodes.push({
                id: technique.id,
                name: technique.name,
                type: 'd3fend',
                description: technique.description
            });
            
            // Connect to digital artifacts
            if (technique.digitalArtifacts) {
                technique.digitalArtifacts.forEach(artifactName => {
                    // Find the artifact by name
                    const artifact = this.digitalArtifacts.find(a => a.name === artifactName);
                    if (artifact) {
                        this.links.push({
                            source: technique.id,
                            target: artifact.id,
                            type: 'artifact-to-d3fend'
                        });
                    }
                });
            }
        });
    }

    // Create the force-directed graph visualization
    createVisualization() {
        // Add arrow markers for directed links
        this.svg.append('defs').selectAll('marker')
            .data(['attack-to-artifact', 'artifact-to-d3fend'])
            .enter().append('marker')
            .attr('id', d => d)
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 20)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('fill', d => d === 'attack-to-artifact' ? '#ff7f0e' : '#2ca02c');
        
        // Create links
        this.linkElements = this.svg.append('g')
            .selectAll('line')
            .data(this.links)
            .enter().append('line')
            .attr('class', 'link')
            .attr('stroke', d => d.type === 'attack-to-artifact' ? '#ff7f0e' : '#2ca02c')
            .attr('stroke-width', 2)
            .attr('marker-end', d => `url(#${d.type})`);
        
        // Create node groups
        this.nodeGroups = this.svg.append('g')
            .selectAll('.node')
            .data(this.nodes)
            .enter().append('g')
            .attr('class', 'node')
            .call(d3.drag()
                .on('start', (event, d) => this.dragstarted(event, d))
                .on('drag', (event, d) => this.dragged(event, d))
                .on('end', (event, d) => this.dragended(event, d)))
            .on('mouseover', (event, d) => this.showTooltip(event, d))
            .on('mouseout', () => this.hideTooltip())
            .on('click', (event, d) => this.nodeClicked(event, d));
        
        // Add circles to nodes
        this.nodeGroups.append('circle')
            .attr('r', d => d.type === 'artifact' ? 15 : 10)
            .attr('fill', d => {
                if (d.type === 'attack') return '#ff7f0e';
                if (d.type === 'artifact') return '#1f77b4';
                return '#2ca02c'; // d3fend
            });
        
        // Add text labels to nodes
        this.nodeGroups.append('text')
            .attr('dx', 15)
            .attr('dy', 4)
            .text(d => d.name)
            .style('font-size', '10px');
    }

    // Update the force simulation on each tick
    ticked() {
        this.linkElements
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
        
        this.nodeGroups
            .attr('transform', d => `translate(${d.x},${d.y})`);
    }

    // Handle the start of node dragging
    dragstarted(event, d) {
        if (!event.active) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    // Handle node dragging
    dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    // Handle the end of node dragging
    dragended(event, d) {
        if (!event.active) this.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    // Show tooltip on node hover
    showTooltip(event, d) {
        this.tooltip.transition()
            .duration(200)
            .style('opacity', .9);
        
        this.tooltip.html(`
            <strong>${d.name}</strong><br/>
            <em>${d.type === 'attack' ? 'ATT&CK Technique' : 
                  d.type === 'd3fend' ? 'D3FEND Technique' : 
                  'Digital Artifact'}</em><br/>
            ${d.description.substring(0, 100)}${d.description.length > 100 ? '...' : ''}
        `)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 28) + 'px');
    }

    // Hide tooltip
    hideTooltip() {
        this.tooltip.transition()
            .duration(500)
            .style('opacity', 0);
    }

    // Handle node click
    nodeClicked(event, d) {
        // Highlight the node and its connections
        this.highlightNode(d);
        
        // Display details about the selected node
        this.showNodeDetails(d);
    }

    // Highlight a node and its connections
    highlightNode(node) {
        // Reset all nodes and links to default appearance
        this.nodeGroups.selectAll('circle')
            .attr('stroke', null)
            .attr('stroke-width', 0);
        
        this.linkElements
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', 2);
        
        // Highlight the selected node
        this.nodeGroups.filter(d => d.id === node.id)
            .select('circle')
            .attr('stroke', '#000')
            .attr('stroke-width', 2);
        
        // Highlight connected links and nodes
        const connectedLinks = this.links.filter(l => 
            l.source.id === node.id || l.target.id === node.id
        );
        
        const connectedNodeIds = new Set();
        connectedLinks.forEach(link => {
            connectedNodeIds.add(link.source.id);
            connectedNodeIds.add(link.target.id);
        });
        
        // Highlight connected links
        this.linkElements
            .filter(l => connectedLinks.includes(l))
            .attr('stroke-opacity', 1)
            .attr('stroke-width', 3);
        
        // Highlight connected nodes
        this.nodeGroups
            .filter(d => connectedNodeIds.has(d.id) && d.id !== node.id)
            .select('circle')
            .attr('stroke', '#666')
            .attr('stroke-width', 1.5);
    }

    // Show details about the selected node
    showNodeDetails(node) {
        let html = `<h4>${node.name}</h4>`;
        
        if (node.type === 'attack') {
            html += `<p><strong>ATT&CK Technique:</strong> ${node.id}</p>`;
            html += `<p>${node.description}</p>`;
            
            // Find D3FEND countermeasures for this ATT&CK technique
            const mapping = this.attackMappings.find(m => m.attackId === node.id);
            if (mapping && mapping.d3fendTechniques.length > 0) {
                html += '<h5>D3FEND Countermeasures:</h5><ul>';
                mapping.d3fendTechniques.forEach(techId => {
                    const tech = this.d3fendTechniques.find(t => t.id === techId);
                    if (tech) {
                        html += `<li><strong>${tech.id}:</strong> ${tech.name}</li>`;
                    }
                });
                html += '</ul>';
            }
        } else if (node.type === 'd3fend') {
            html += `<p><strong>D3FEND Technique:</strong> ${node.id}</p>`;
            html += `<p>${node.description}</p>`;
            
            // Find ATT&CK techniques this D3FEND countermeasure addresses
            const relatedMappings = this.attackMappings.filter(m => 
                m.d3fendTechniques.includes(node.id)
            );
            
            if (relatedMappings.length > 0) {
                html += '<h5>Addresses ATT&CK Techniques:</h5><ul>';
                relatedMappings.forEach(mapping => {
                    html += `<li><strong>${mapping.attackId}:</strong> ${mapping.attackName}</li>`;
                });
                html += '</ul>';
            }
        } else if (node.type === 'artifact') {
            html += `<p><strong>Digital Artifact:</strong> ${node.id}</p>`;
            html += `<p>${node.description}</p>`;
            
            // Find related ATT&CK techniques
            const relatedAttack = this.attackMappings.filter(m => 
                m.digitalArtifacts.includes(node.id)
            );
            
            if (relatedAttack.length > 0) {
                html += '<h5>Related ATT&CK Techniques:</h5><ul>';
                relatedAttack.forEach(mapping => {
                    html += `<li><strong>${mapping.attackId}:</strong> ${mapping.attackName}</li>`;
                });
                html += '</ul>';
            }
            
            // Find related D3FEND techniques
            const relatedD3fend = this.d3fendTechniques.filter(t => 
                t.digitalArtifacts && t.digitalArtifacts.includes(node.name)
            );
            
            if (relatedD3fend.length > 0) {
                html += '<h5>Related D3FEND Techniques:</h5><ul>';
                relatedD3fend.forEach(tech => {
                    html += `<li><strong>${tech.id}:</strong> ${tech.name}</li>`;
                });
                html += '</ul>';
            }
        }
        
        // Update the details panel
        d3.select('#technique-details').html(html);
    }

    // Set up event listeners
    setupEventListeners() {
        // Listen for technique selection from the matrix visualization
        document.addEventListener('techniqueSelected', event => {
            const technique = event.detail;
            this.updateForTechnique(technique);
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.width = this.container.node().getBoundingClientRect().width;
            this.svg.attr('width', this.width);
            this.simulation.force('center', d3.forceCenter(this.width / 2, this.height / 2))
                .alpha(0.3).restart();
        });
    }

    // Update the visualization for a selected technique
    updateForTechnique(technique) {
        this.selectedTechnique = technique;
        
        // Reset graph data
        this.nodes = [];
        this.links = [];
        
        // Add the selected D3FEND technique
        this.nodes.push({
            id: technique.id,
            name: technique.name,
            type: 'd3fend',
            description: technique.description
        });
        
        // Add related digital artifacts
        if (technique.digitalArtifacts && technique.digitalArtifacts.length > 0) {
            technique.digitalArtifacts.forEach(artifactName => {
                // Find the artifact by name
                const artifact = this.digitalArtifacts.find(a => a.name === artifactName);
                if (artifact) {
                    // Add artifact node if not already present
                    if (!this.nodes.some(n => n.id === artifact.id)) {
                        this.nodes.push({
                            id: artifact.id,
                            name: artifact.name,
                            type: 'artifact',
                            description: artifact.description
                        });
                    }
                    
                    // Add link from technique to artifact
                    this.links.push({
                        source: technique.id,
                        target: artifact.id,
                        type: 'artifact-to-d3fend'
                    });
                    
                    // Find related ATT&CK techniques
                    artifact.relatedAttackTechniques.forEach(attackId => {
                        // Find the ATT&CK mapping
                        const attackMapping = this.attackMappings.find(m => m.attackId === attackId);
                        if (attackMapping) {
                            // Add ATT&CK node if not already present
                            if (!this.nodes.some(n => n.id === attackMapping.attackId)) {
                                this.nodes.push({
                                    id: attackMapping.attackId,
                                    name: attackMapping.attackName,
                                    type: 'attack',
                                    description: `ATT&CK Technique: ${attackMapping.attackName}`
                                });
                            }
                            
                            // Add link from ATT&CK to artifact
                            this.links.push({
                                source: attackMapping.attackId,
                                target: artifact.id,
                                type: 'attack-to-artifact'
                            });
                        }
                    });
                }
            });
        }
        
        // Update the visualization
        this.updateVisualization();
    }

    // Update the force-directed graph visualization
    updateVisualization() {
        // Remove existing elements
        this.svg.selectAll('*').remove();
        
        // Re-initialize simulation
        this.simulation = d3.forceSimulation(this.nodes)
            .force('link', d3.forceLink(this.links).id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(this.width / 2, this.height / 2))
            .force('collision', d3.forceCollide().radius(50))
            .on('tick', () => this.ticked());
        
        // Recreate the visualization
        this.createVisualization();
    }
}
