# **LogMan**

Real-time Log Streaming with Django, Daphne, and Vue.js

![License](https://img.shields.io/badge/license-BSD-green)
![Vue](https://img.shields.io/badge/vue-3.x-brightgreen)
![Python](https://img.shields.io/badge/python-3.10%2B-blue)
![Django](https://img.shields.io/badge/django-5.x-darkgreen)
![Nginx](https://img.shields.io/badge/nginx-1.28-red)

---

## **Overview**

**LogMan** is a real-time log streaming solution that leverages **Django Channels**, **Daphne**, and **WebSockets** for efficient log delivery, combined with a **Vue.js** frontend for a dynamic and responsive user experience.

Whether you need to monitor application logs, server processes, or custom pipelines, LogMan provides a seamless way to **stream logs live in the browser** without refreshing the page.

---

## **Features**

* ✅ **Real-time log streaming** via WebSockets (no polling required)
* ✅ **Django + Channels backend** with Daphne ASGI server
* ✅ **Vue.js single-page application (SPA)** for an interactive UI
* ✅ **Scalable architecture** for handling multiple log streams concurrently
* ✅ **Lightweight and extensible** for custom log sources
* ✅ **Authentication support** (token-based)
* ✅ **Docker-ready** for production deployments

---

## **Architecture**

```
   ┌───────────────┐        ┌─────────────┐        ┌───────────────┐
   │    Log File   │  -->   │ Django App  │  -->   │ WebSocket API │
   └───────────────┘        │ Channels    │        │   via Daphne  │
                            └─────────────┘        └───────────────┘
                                   │
                             Real-time Logs
                                   │
                          ┌─────────────────┐
                          │ Vue.js Frontend │
                          └─────────────────┘
```

---

## **Tech Stack**

* **Backend:** Django 5.x, Django Channels, Daphne, Redis (for channel layers)
* **Frontend:** Vue.js 3, Vue Router, Axios
* **WebSocket Protocol:** ASGI
* **Database:** PostgreSQL
* **Containerization:** Docker

---

## **Installation**

### **Prerequisites**

* Node.js **14+** & npm or yarn

---

### **Setup**

1. **Clone the repository**

   ```bash
   git clone https://github.com/devngugi/logman-ui
   cd logman-ui
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Populate your env file with the IP that the backend is running on**

   ```bash
   cp .env.example .env
   ```

4. **Build the app for production**

   ```bash
   npm run build
   ```
---

## **Deployment**
1. **Populate and copy the nginx configuration file to your nginx conf.d directory.**

    ```bash
   # this removes the hassle of symlinks in the sites-enabled directory
   sudo cp deployment_configs/logman_ui.conf /etc/nginx/conf.d/logman_ui.conf
   ```

2. **Restart the nginx service**

   ```bash
   sudo systemctl restart nginx.service
   ```
* Note: Next, deploy the backend by following the instructions [here](https://github.com/devngugi/logman_backend)

---

* IMPORTANT! - If you plan to deploy via a proxy, on an already existing deployment, then include follow along:
3. **Edit the `vite.config.js` file to include the path that you will use on the proxy**

    ```bash
       # edit the `base` to match the path you will use on the proxy e.g base: "/logman/"
    ```

4. **Copy and edit the `.env` include the domain used by the proxy**

    ```bash
       cp deployment_configs/.env.proxy .env
    ```

5. **Add the configuration on the nginx config file for the proxy**

    ```yaml
      location /logman/ {
	        proxy_pass http://192.xxx.xx.xx:5173/; // ensure this points to the nginx port that the frontend is listening on the host server
      }

      location /logman/src/ {
          proxy_pass http://192.xxx.xx.xx:8080/; // ensure this points to the nginx port that the backend is listening on the host server
          proxy_http_version 1.1;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
          # Pass through websocket upgrade headers
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection "upgrade";
      }
    ```

* Note: Ensure to add the proxy domain on the backend's env `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS`
---

## **License**

BSD License.

---

✅ Do you want me to **add code examples** for:

* Django Channels consumer (`logs/consumers.py`)
* Vue WebSocket client integration
  so the README includes **quick start code snippets** for developers?
