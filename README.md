# MITRE D3FEND Matrix Visualization

An interactive visualization tool for the MITRE D3FEND Matrix, allowing cybersecurity professionals to map defensive countermeasures to adversary techniques.

## Overview

MITRE D3FEND (Detection, Denial, and Disruption Framework Empowering Network Defense) is a knowledge base of cybersecurity countermeasure techniques developed by the MITRE Corporation. It complements the MITRE ATT&CK framework by focusing on defensive measures.

This visualization tool aims to:

1. Provide an interactive representation of the D3FEND Matrix
2. Enable mapping between ATT&CK techniques and D3FEND countermeasures
3. Help organizations identify gaps in their defensive coverage
4. Offer visual insights into the relationship between attacks, digital artifacts, and defenses

## Features

- **Interactive D3FEND Matrix**: Visual representation of all D3FEND tactics and techniques
- **ATT&CK Mapping**: Map offensive techniques to relevant defensive countermeasures
- **Digital Artifacts Bridge**: Visualize the connection between ATT&CK and D3FEND via Digital Artifacts
- **Coverage Analysis**: Identify and highlight gaps in defensive measures
- **Export Capabilities**: Export visualizations and mappings in various formats (JSON, CSV, PNG)
- **Customizable Views**: Filter and sort techniques based on different criteria

## D3FEND Tactics

The D3FEND Matrix is organized into six primary tactics:

1. **Model**: Apply security engineering, threat, vulnerability, and risk analyses to digital systems
2. **Harden**: Increase the opportunity cost of network exploitation through protective measures
3. **Detect**: Discover if adversaries can access networks or identify unauthorized activity
4. **Isolate**: Create physical or logical barriers in a network to prevent lateral movement
5. **Deceive**: Use deception to redirect attackers away from sensitive systems
6. **Evict**: Remove attacker access and presence from compromised systems

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/sivolko/mitre-d3fend-visualization.git

# Navigate to the project directory
cd mitre-d3fend-visualization

# Install dependencies
npm install

# Start the development server
npm start
```

## Usage

1. Browse the interactive D3FEND Matrix visualization
2. Select an ATT&CK technique to see related D3FEND countermeasures
3. Filter techniques by tactic, effectiveness, or implementation complexity
4. Export your custom mappings for integration with other security tools

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- MITRE Corporation for developing the D3FEND framework
- D3.js for providing the visualization library
- The cybersecurity community for continuous feedback and improvements

## Resources

- [MITRE D3FEND Website](https://d3fend.mitre.org/)
- [MITRE ATT&CK Framework](https://attack.mitre.org/)
- [D3FEND Matrix](https://d3fend.mitre.org/matrix/)
