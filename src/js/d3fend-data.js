/**
 * d3fend-data.js - Contains the data structure for the MITRE D3FEND Matrix
 * 
 * This file defines the tactics, techniques, and mappings for the D3FEND Matrix visualization.
 * It also includes sample mappings between ATT&CK techniques and D3FEND countermeasures.
 */

// D3FEND Tactics
const D3FEND_TACTICS = [
    {
        id: "model",
        name: "Model",
        description: "Apply security engineering, threat, vulnerability, and risk analyses to digital systems by creating and maintaining a common understanding of the defended systems, actors using the systems, the operations on those systems, and the relationships and interactions between these elements."
    },
    {
        id: "harden",
        name: "Harden",
        description: "Increase the opportunity cost of network exploitation. Hardening is generally conducted before a system goes online and becomes operational."
    },
    {
        id: "detect",
        name: "Detect",
        description: "Discover if adversaries can access computer networks or identify unauthorized activity."
    },
    {
        id: "isolate",
        name: "Isolate",
        description: "Create physical or logical barriers in a network, reducing the opportunity for the adversary to gain further access or achieve lateral movement."
    },
    {
        id: "deceive",
        name: "Deceive",
        description: "Advertise, entice, or allow potential attackers access to a controlled environment to prevent them from reaching sensitive areas."
    },
    {
        id: "evict",
        name: "Evict",
        description: "Remove adversary access and presence from compromised systems."
    }
];

// Sample D3FEND Techniques (abbreviated list for demonstration)
const D3FEND_TECHNIQUES = [
    // MODEL
    {
        id: "D3-AM",
        name: "Access Modeling",
        tactic: "model",
        description: "Access modeling is the process of creating, maintaining, and analyzing models of access mechanisms.",
        digitalArtifacts: ["Access Control Configuration", "Access Token"]
    },
    {
        id: "D3-NM",
        name: "Network Mapping",
        tactic: "model",
        description: "Network mapping is the process of creating, maintaining, and analyzing network models that detail the digital network topology.",
        digitalArtifacts: ["Network Node", "Network Link"]
    },
    {
        id: "D3-AI",
        name: "Asset Inventory",
        tactic: "model",
        description: "Asset inventory is the process of creating, maintaining, analyzing, and validating an inventory of the hardware, software, and digital information in an environment.",
        digitalArtifacts: ["Hardware Device", "Software", "Digital Information"]
    },
    
    // HARDEN
    {
        id: "D3-CH",
        name: "Credential Hardening",
        tactic: "harden",
        description: "Credential hardening involves implementing practices that make credentials resistant to theft or exploitation.",
        digitalArtifacts: ["Password", "Credential", "User Account"]
    },
    {
        id: "D3-PH",
        name: "Platform Hardening",
        tactic: "harden",
        description: "Platform hardening involves making changes to an operating system or application platform to make it more secure.",
        digitalArtifacts: ["Operating System", "Application", "System Configuration"]
    },
    {
        id: "D3-ACH",
        name: "Application Configuration Hardening",
        tactic: "harden",
        description: "Application configuration hardening involves making changes to an application's configuration to make it more secure.",
        digitalArtifacts: ["Application Configuration", "Application"]
    },
    
    // DETECT
    {
        id: "D3-NTA",
        name: "Network Traffic Analysis",
        tactic: "detect",
        description: "Network traffic analysis involves inspecting network traffic to detect suspicious activity.",
        digitalArtifacts: ["Network Traffic", "Network Packet", "Network Flow"]
    },
    {
        id: "D3-PA",
        name: "Process Analysis",
        tactic: "detect",
        description: "Process analysis involves monitoring process execution and characteristics to detect suspicious activity.",
        digitalArtifacts: ["Process", "Thread", "Process Image"]
    },
    {
        id: "D3-FCOA",
        name: "File Content Analysis",
        tactic: "detect",
        description: "File content analysis involves examining the content of files to detect suspicious activity.",
        digitalArtifacts: ["File", "File Content Block", "File Metadata"]
    },
    
    // ISOLATE
    {
        id: "D3-NI",
        name: "Network Isolation",
        tactic: "isolate",
        description: "Network isolation involves segmenting networks to prevent lateral movement.",
        digitalArtifacts: ["Network", "Network Node", "Firewall"]
    },
    {
        id: "D3-KBPI",
        name: "Kernel-based Process Isolation",
        tactic: "isolate",
        description: "Kernel-based process isolation involves using kernel mechanisms to isolate processes from one another.",
        digitalArtifacts: ["Process", "Kernel", "Memory Address Space"]
    },
    {
        id: "D3-DENCR",
        name: "Disk Encryption",
        tactic: "isolate",
        description: "Disk encryption involves encrypting data at rest to prevent unauthorized access.",
        digitalArtifacts: ["Disk", "Volume", "Storage"]
    },
    
    // DECEIVE
    {
        id: "D3-DE",
        name: "Decoy Environment",
        tactic: "deceive",
        description: "A decoy environment is a system designed to appear as a legitimate target to adversaries.",
        digitalArtifacts: ["System", "Network", "Service"]
    },
    {
        id: "D3-DF",
        name: "Decoy File",
        tactic: "deceive",
        description: "A decoy file is a file designed to appear as a legitimate target to adversaries.",
        digitalArtifacts: ["File", "Document File", "Executable File"]
    },
    {
        id: "D3-DUC",
        name: "Decoy User Credential",
        tactic: "deceive",
        description: "A decoy user credential is a credential designed to appear as a legitimate target to adversaries.",
        digitalArtifacts: ["User Account", "Credential", "Password"]
    },
    
    // EVICT
    {
        id: "D3-CE",
        name: "Credential Eviction",
        tactic: "evict",
        description: "Credential eviction involves removing compromised credentials from a system.",
        digitalArtifacts: ["Credential", "User Account", "Session Token"]
    },
    {
        id: "D3-PE",
        name: "Process Eviction",
        tactic: "evict",
        description: "Process eviction involves terminating malicious processes on a system.",
        digitalArtifacts: ["Process", "Thread", "Process Image"]
    },
    {
        id: "D3-OE",
        name: "Object Eviction",
        tactic: "evict",
        description: "Object eviction involves removing malicious objects from a system.",
        digitalArtifacts: ["File", "Registry Key", "Configuration Database Record"]
    },
];

// Digital Artifacts (sample, abbreviated for demonstration)
const DIGITAL_ARTIFACTS = [
    {
        id: "DA-01",
        name: "Process",
        description: "A process is an instance of a computer program that is being executed.",
        relatedAttackTechniques: ["T1055", "T1057", "T1106"],
        relatedDefenseTechniques: ["D3-PA", "D3-KBPI", "D3-PE"]
    },
    {
        id: "DA-02",
        name: "Network Traffic",
        description: "Network traffic refers to the data moving across a network at any given time.",
        relatedAttackTechniques: ["T1071", "T1095", "T1571"],
        relatedDefenseTechniques: ["D3-NTA", "D3-NI"]
    },
    {
        id: "DA-03",
        name: "File",
        description: "A file is a collection of data stored in a computer system.",
        relatedAttackTechniques: ["T1005", "T1083", "T1222"],
        relatedDefenseTechniques: ["D3-FCOA", "D3-DF", "D3-OE"]
    },
    {
        id: "DA-04",
        name: "Credential",
        description: "A credential is data that is passed in an authentication protocol exchange.",
        relatedAttackTechniques: ["T1003", "T1110", "T1550"],
        relatedDefenseTechniques: ["D3-CH", "D3-DUC", "D3-CE"]
    },
    {
        id: "DA-05",
        name: "User Account",
        description: "A user account allows a user to authenticate to a system and be granted authorization to access resources.",
        relatedAttackTechniques: ["T1078", "T1087", "T1136"],
        relatedDefenseTechniques: ["D3-CH", "D3-DUC", "D3-CE"]
    }
];

// Sample ATT&CK to D3FEND Mappings (abbreviated)
const ATTACK_TO_D3FEND_MAPPINGS = [
    {
        attackId: "T1003", // OS Credential Dumping
        attackName: "OS Credential Dumping",
        d3fendTechniques: ["D3-CH", "D3-PA", "D3-CE"],
        digitalArtifacts: ["DA-04"]
    },
    {
        attackId: "T1055", // Process Injection
        attackName: "Process Injection",
        d3fendTechniques: ["D3-PA", "D3-KBPI", "D3-PE"],
        digitalArtifacts: ["DA-01"]
    },
    {
        attackId: "T1071", // Application Layer Protocol
        attackName: "Application Layer Protocol",
        d3fendTechniques: ["D3-NTA", "D3-NI"],
        digitalArtifacts: ["DA-02"]
    },
    {
        attackId: "T1078", // Valid Accounts
        attackName: "Valid Accounts",
        d3fendTechniques: ["D3-CH", "D3-DUC", "D3-CE"],
        digitalArtifacts: ["DA-04", "DA-05"]
    },
    {
        attackId: "T1083", // File and Directory Discovery
        attackName: "File and Directory Discovery",
        d3fendTechniques: ["D3-FCOA", "D3-DF"],
        digitalArtifacts: ["DA-03"]
    }
];
