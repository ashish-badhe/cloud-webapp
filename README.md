# webapp


## Prerequisites

- Node.js installed
- npm (Node Package Manager) installed

## Getting Started

To get a copy and run the project locally, follow below steps.

### Installation

1. Clone the repository
2. Create a new .env file and enter below credentials
   1. HOST
   2. DATABASE_NAME
   3. DATABASE_USER
   4. DATABASE_PASSWORD
   5. PORT
3. Run the below command to install required dependencies:
   ```bash
   npm install

Your node server will start on given port.

## Packer Commands

packer init packer/gcp.pkr.hcl

##$ Only checks if there are any formatting changes
packer fmt -check packer/gcp.pkr.hcl

### Formats file in place
packer fmt packer/gcp.pkr.hcl


packer validate packer/gcp.pkr.hcl

packer build packer/gcp.pkr.hcl
    
