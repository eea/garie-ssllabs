### Changelog

#### 1.2.0 - 2025-04-07
- **Code Refactoring**: Remove docker depenency and use ssllabs binary directly.
  - **File**: Dockerfile
  - **Details**: Added build steps for ssllabs binary. Changed to Node 20 LTS. 
  - **File**: src/ssllabs.sh
  - **Details**: removed docker run command and used ssllabs binary directly.