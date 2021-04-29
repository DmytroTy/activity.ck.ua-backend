# Docker-compose. Start server in container

## 1. Create .env file
```bash
cp .env.example .env
```

## 2. Replace parameters with real
```bash
nano .env
```

## 3. Start container
```bash
sudo docker-compose up --build
```

## 4. Migrations
### 1. Start migration with found container_id
```bash
sudo docker exec -it node npm run knex:migrate:latest
```
---------------------------
# Extra:

## 1. Seeds
### Create default user, organization, place(s) or event(s). You can add extra parameters: `count`. Where `count` is how many will be created. If you don't add any parameters they set by default.

### Examples:
### 1. Create new user and new organization.
```bash
sudo docker exec -it node npm run seeds:default
```

### 2. Create 50 PLACES by default with new user and new organization
```bash
sudo docker exec -it node npm run seeds:places
```

### 3. Create `10` PLACES with new user and new organization
```bash
sudo docker exec -it node npm run seeds:places count=10
```

### 4. Create 50 EVENTS by default with new user and new organization
```bash
sudo docker exec -it node npm run seeds:events
```

### 5. Create `10` EVENTS with new user and new organization
```bash
sudo docker exec -it node npm run seeds:events count=10
```
