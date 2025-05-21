/**
 * main.js - Main entry point for the D3FEND Matrix Visualization application
 * 
 * This file handles the initialization of the visualization components
 * and coordinates interactions between them.
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the D3FEND Matrix visualization
    const matrixViz = new D3FendMatrixViz('d3fend-matrix-container', {
        tactics: D3FEND_TACTICS,
        techniques: D3FEND_TECHNIQUES
    });
    matrixViz.init();
    
    // Initialize the Digital Artifacts visualization
    const artifactsViz = new DigitalArtifactsViz('digital-artifacts-container', {
        digitalArtifacts: DIGITAL_ARTIFACTS,
        attackMappings: ATTACK_TO_D3FEND_MAPPINGS,
        d3fendTechniques: D3FEND_TECHNIQUES
    });
    artifactsViz.init();
    
    // Log initialization complete
    console.log('MITRE D3FEND Matrix Visualization initialized successfully.');
    
    // Add a welcome message
    displayWelcomeMessage();
});

// Display welcome message with quick instructions
function displayWelcomeMessage() {
    const detailsPanel = document.getElementById('technique-details');
    
    detailsPanel.innerHTML = `
        <h4>Welcome to the MITRE D3FEND Matrix Visualization</h4>
        <p>This tool helps you explore the MITRE D3FEND Matrix and understand the relationships between:</p>
        <ul>
            <li>Defensive techniques (D3FEND)</li>
            <li>Offensive techniques (ATT&CK)</li>
            <li>Digital artifacts that connect them</li>
        </ul>
        <p><strong>Getting Started:</strong></p>
        <ol>
            <li>Browse the D3FEND Matrix above to explore defensive techniques</li>
            <li>Click on a technique to see its details</li>
            <li>Enable "Show ATT&CK Mappings" to see related offensive techniques</li>
            <li>Explore the Digital Artifacts bridge to understand the connections</li>
        </ol>
        <p>Select a technique from the matrix to begin.</p>
    `;
}
