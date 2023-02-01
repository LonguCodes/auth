# Register flow

### 1. Concept

```mermaid
%%{
  init: {
    'theme': 'forest'
  }
}%%
flowchart LR
    frontend(Frontend)
    backend(Backend)
    auth(Auth microservice)
    
    frontend-->|1. Send credentials|auth
    auth-->|2. Receive access and refresh tokens|frontend
    frontend-->|3. Send requests with token|backend
```

### 2. Core setup

None! Registering works out of the box

### 3. Backend setup

See [Login flow](./login-flow.md) for more information about how to authenticate the user.
