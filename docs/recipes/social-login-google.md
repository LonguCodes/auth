# Social login: Google

### 1. Concept

```mermaid
%%{
  init: {
    'theme': 'forest'
  }
}%%
sequenceDiagram
    
    participant Frontend
    participant Auth
    participant Google
    

    Frontend->>Google: 1. Go through login
    Google->>Frontend: 2. Receive Login code
    Frontend->>Auth: 3. Request login
    Auth->>Auth: 4. Login or create user
    Auth->>Frontend: 5. Receive tokens
```

### 2. Core setup

Logging in with Google requires `@longucodes/auth-plugin-google` plugin to be loaded. 
For plugin configuration options, see [README](../../libs/auth-plugin-google/README.md)

### 3. Backend setup

Nothing! Everything is implemented in the Auth Core
