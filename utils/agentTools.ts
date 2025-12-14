// Combined library of tools for Puter.js AI Agent

export interface AgentArtifact {
    isArtifact: true;
    type: 'website' | 'image' | 'video' | 'audio';
    title: string;
    url: string;
    description?: string;
}

// --- 1. File System Tools ---
const fsTools = [
    {
        type: "function",
        function: {
            name: "fs_write",
            description: "Write text content to a file. Overwrites if exists.",
            parameters: {
                type: "object",
                properties: {
                    path: { type: "string", description: "File path (e.g., 'notes.txt' or 'src/index.html')" },
                    content: { type: "string", description: "The text content to write" }
                },
                required: ["path", "content"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "fs_read",
            description: "Read the text content of a file.",
            parameters: {
                type: "object",
                properties: {
                    path: { type: "string", description: "File path to read" }
                },
                required: ["path"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "fs_list",
            description: "List files and directories in a specific path.",
            parameters: {
                type: "object",
                properties: {
                    path: { type: "string", description: "Directory path (use './' for root)" }
                },
                required: ["path"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "fs_mkdir",
            description: "Create a new directory.",
            parameters: {
                type: "object",
                properties: {
                    path: { type: "string", description: "Directory path to create" }
                },
                required: ["path"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "fs_delete",
            description: "Delete a file or directory.",
            parameters: {
                type: "object",
                properties: { path: { type: "string" } },
                required: ["path"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "fs_move",
            description: "Move or Rename a file.",
            parameters: {
                type: "object",
                properties: { 
                    source: { type: "string" },
                    destination: { type: "string" }
                },
                required: ["source", "destination"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "fs_copy",
            description: "Copy a file.",
            parameters: {
                type: "object",
                properties: { 
                    source: { type: "string" },
                    destination: { type: "string" }
                },
                required: ["source", "destination"]
            }
        }
    }
];

const fsHandlers = {
    fs_write: async ({ path, content }: any) => {
        const file = await puter.fs.write(path, content);
        return `Successfully wrote to ${file.path}`;
    },
    fs_read: async ({ path }: any) => {
        const blob = await puter.fs.read(path);
        const text = await blob.text();
        return text;
    },
    fs_list: async ({ path }: any) => {
        const items = await puter.fs.readdir(path);
        return items.map((i: any) => `${i.is_dir ? '[DIR]' : '[FILE]'} ${i.name}`).join("\n");
    },
    fs_mkdir: async ({ path }: any) => {
        await puter.fs.mkdir(path);
        return `Created directory: ${path}`;
    },
    fs_delete: async ({ path }: any) => {
        await puter.fs.delete(path);
        return `Deleted ${path}`;
    },
    fs_move: async ({ source, destination }: any) => {
        await puter.fs.move(source, destination);
        return `Moved ${source} to ${destination}`;
    },
    fs_copy: async ({ source, destination }: any) => {
        await puter.fs.copy(source, destination);
        return `Copied ${source} to ${destination}`;
    }
};

// --- 2. Hosting Tools ---
const hostingTools = [
    {
        type: "function",
        function: {
            name: "site_deploy",
            description: "Host a directory as a website on a subdomain. Returns an Artifact.",
            parameters: {
                type: "object",
                properties: {
                    subdomain: { type: "string", description: "The subdomain name (e.g., 'myapp' -> myapp.puter.site)" },
                    directory: { type: "string", description: "The directory path containing index.html" }
                },
                required: ["subdomain", "directory"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "site_list",
            description: "List all active websites/subdomains.",
            parameters: { type: "object", properties: {} }
        }
    }
];

const hostingHandlers = {
    site_deploy: async ({ subdomain, directory }: any) => {
        // @ts-ignore
        const site = await puter.hosting.create(subdomain, directory);
        const url = `https://${site.subdomain}.puter.site`;

        return {
            isArtifact: true,
            type: 'website',
            title: `Deployed: ${subdomain}`,
            url: url,
            description: `Live at ${url}`
        } as AgentArtifact;
    },
    site_list: async () => {
        // @ts-ignore
        const sites = await puter.hosting.list();
        if (sites.length === 0) return "No active websites found.";
        return sites.map((s: any) => `https://${s.subdomain}.puter.site (Root: ${s.root_dir?.path})`).join("\n");
    }
};

// --- 3. Key-Value Tools ---
const kvTools = [
    {
        type: "function",
        function: {
            name: "db_set",
            description: "Save a value to the database (Key-Value store).",
            parameters: {
                type: "object",
                properties: {
                    key: { type: "string", description: "Key name" },
                    value: { type: "string", description: "Value to store (strings only)" }
                },
                required: ["key", "value"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "db_get",
            description: "Retrieve a value from the database.",
            parameters: {
                type: "object",
                properties: {
                    key: { type: "string", description: "Key name" }
                },
                required: ["key"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "db_delete",
            description: "Remove a specific key from the database.",
            parameters: {
                type: "object",
                properties: { key: { type: "string" } },
                required: ["key"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "db_list_keys",
            description: "List all keys currently stored in the database.",
            parameters: { type: "object", properties: {} }
        }
    },
    {
        type: "function",
        function: {
            name: "db_increment",
            description: "Increment a numeric value in the database.",
            parameters: {
                type: "object",
                properties: { 
                    key: { type: "string" },
                    amount: { type: "number", description: "Amount to add (default 1)" }
                },
                required: ["key"]
            }
        }
    }
];

const kvHandlers = {
    db_set: async ({ key, value }: any) => {
        await puter.kv.set(key, value);
        return `Saved key '${key}'.`;
    },
    db_get: async ({ key }: any) => {
        const val = await puter.kv.get(key);
        return val ? String(val) : "Key not found or null.";
    },
    db_delete: async ({ key }: any) => {
        await puter.kv.del(key);
        return `Deleted key: ${key}`;
    },
    db_list_keys: async () => {
        const keys = await puter.kv.list();
        return `Active Keys: ${keys.join(", ")}`;
    },
    db_increment: async ({ key, amount = 1 }: any) => {
        // @ts-ignore
        const newVal = await puter.kv.incr(key, amount);
        return `New value for ${key}: ${newVal}`;
    }
};

// --- 4. Networking & UI Tools ---
const utilTools = [
    {
        type: "function",
        function: {
            name: "web_fetch",
            description: "Fetch the text content of a URL (No CORS restrictions).",
            parameters: {
                type: "object",
                properties: {
                    url: { type: "string", description: "Target URL (https://...)" }
                },
                required: ["url"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "ui_alert",
            description: "Show a popup alert to the user.",
            parameters: {
                type: "object",
                properties: {
                    message: { type: "string", description: "Message to display" }
                },
                required: ["message"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "create_window",
            description: "Open a new floating window with HTML content.",
            parameters: {
                type: "object",
                properties: {
                    title: { type: "string", description: "Window title" },
                    html_content: { type: "string", description: "The HTML to put inside the window" },
                    width: { type: "number", description: "Width in pixels (default 500)" },
                    height: { type: "number", description: "Height in pixels (default 400)" }
                },
                required: ["title", "html_content"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "launch_app",
            description: "Launch an installed Puter app by name.",
            parameters: {
                type: "object",
                properties: {
                    app_name: { type: "string", description: "Name of app (e.g., 'editor', 'terminal')" }
                },
                required: ["app_name"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "ui_prompt",
            description: "Ask the user for text input via a popup.",
            parameters: {
                type: "object",
                properties: {
                    message: { type: "string", description: "Question to ask the user" }
                },
                required: ["message"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "ui_pick_color",
            description: "Ask the user to select a color.",
            parameters: { type: "object", properties: {} }
        }
    }
];

const utilHandlers = {
    web_fetch: async ({ url }: any) => {
        try {
            // @ts-ignore
            if (puter.net && puter.net.fetch) {
                // @ts-ignore
                const res = await puter.net.fetch(url);
                if (!res.ok) {
                    return `Error: ${res.status} ${res.statusText}`;
                }
                const text = await res.text();
                if (!text) return "Empty response.";
                
                // Truncate to avoid context limit issues which can cause AI provider errors
                const maxLength = 2500;
                return text.length > maxLength 
                    ? text.slice(0, maxLength) + `\n...(truncated ${text.length - maxLength} chars)` 
                    : text;
            } else {
                 // Fallback if puter.net is not available (may fail due to CORS)
                 const res = await fetch(url);
                 const text = await res.text();
                 return text.slice(0, 2500);
            }
        } catch (e: any) {
            return `Error fetching URL: ${e.message}`;
        }
    },
    ui_alert: async ({ message }: any) => {
        // @ts-ignore
        await puter.ui.alert(message);
        return "Alert displayed to user.";
    },
    create_window: async ({ title, html_content, width = 500, height = 400 }: any) => {
        // @ts-ignore
        puter.ui.createWindow({
            title: title,
            content: html_content,
            width: width,
            height: height,
            center: true
        });
        return "Window created successfully.";
    },
    launch_app: async ({ app_name }: any) => {
        // @ts-ignore
        await puter.ui.launchApp(app_name);
        return `Launched app: ${app_name}`;
    },
    ui_prompt: async ({ message }: any) => {
        // @ts-ignore
        const response = await puter.ui.prompt(message);
        return `User replied: "${response}"`;
    },
    ui_pick_color: async () => {
        // @ts-ignore
        const color = await puter.ui.showColorPicker();
        return `User picked color: ${color}`;
    }
};

// --- 5. AI Generation & Perception Tools ---
const aiTools = [
    {
        type: "function",
        function: {
            name: "generate_image",
            description: "Generate an image from a text description. Returns an Artifact.",
            parameters: {
                type: "object",
                properties: {
                    prompt: { type: "string", description: "Image description" }
                },
                required: ["prompt"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "text_to_speech",
            description: "Convert text to spoken audio. Returns an Artifact.",
            parameters: {
                type: "object",
                properties: {
                    text: { type: "string", description: "The text to speak" }
                },
                required: ["text"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "image_to_text",
            description: "Extract text (OCR) or describe an image.",
            parameters: {
                type: "object",
                properties: {
                    source: { type: "string", description: "URL or Puter file path to the image" }
                },
                required: ["source"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "audio_transcribe",
            description: "Transcribe spoken audio to text (Speech-to-Text).",
            parameters: {
                type: "object",
                properties: {
                    source: { type: "string", description: "URL or Puter file path to the audio file" }
                },
                required: ["source"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "generate_video",
            description: "Generate a video from a text prompt. Returns an Artifact.",
            parameters: {
                type: "object",
                properties: {
                    prompt: { type: "string", description: "Description of the video to create" }
                },
                required: ["prompt"]
            }
        }
    }
];

const aiHandlers = {
    generate_image: async ({ prompt }: any) => {
        const image = await puter.ai.txt2img(prompt);
        return {
            isArtifact: true,
            type: 'image',
            title: 'Generated Image',
            url: image.src,
            description: prompt
        } as AgentArtifact;
    },
    text_to_speech: async ({ text }: any) => {
        const audio = await puter.ai.txt2speech(text);
        return {
            isArtifact: true,
            type: 'audio',
            title: 'Text to Speech',
            url: audio.src,
            description: text.substring(0, 50) + (text.length > 50 ? '...' : '')
        } as AgentArtifact;
    },
    image_to_text: async ({ source }: any) => {
        // @ts-ignore
        const text = await puter.ai.img2txt(source);
        return `Extracted Text: ${text}`;
    },
    audio_transcribe: async ({ source }: any) => {
        // @ts-ignore
        const result = await puter.ai.speech2txt(source);
        return `Transcript: ${typeof result === 'string' ? result : result.text}`;
    },
    generate_video: async ({ prompt }: any) => {
        const video = await puter.ai.txt2vid(prompt);
        return {
            isArtifact: true,
            type: 'video',
            title: 'Generated Video',
            url: video.src,
            description: prompt
        } as AgentArtifact;
    }
};

// --- 6. Worker Tools ---
const workerTools = [
    {
        type: "function",
        function: {
            name: "worker_create",
            description: "Deploy a serverless worker (backend API). Returns the URL.",
            parameters: {
                type: "object",
                properties: {
                    name: { type: "string", description: "Name of the worker" },
                    code: { type: "string", description: "The JavaScript code for the worker (using router.get/post)" }
                },
                required: ["name", "code"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "worker_list",
            description: "List all active serverless workers.",
            parameters: { type: "object", properties: {} }
        }
    },
    {
        type: "function",
        function: {
            name: "worker_delete",
            description: "Delete/Undeploy a worker.",
            parameters: {
                type: "object",
                properties: { name: { type: "string" } },
                required: ["name"]
            }
        }
    }
];

const workerHandlers = {
    worker_create: async ({ name, code }: any) => {
        const filename = `worker_${name}.js`;
        await puter.fs.write(filename, code);
        // @ts-ignore
        const result = await puter.workers.create(name, filename);
        return `Worker deployed successfully at: ${result.url}`;
    },
    worker_list: async () => {
        // @ts-ignore
        const list = await puter.workers.list();
        if (list.length === 0) return "No workers found.";
        return list.map((w: any) => `${w.name} -> ${w.url}`).join("\n");
    },
    worker_delete: async ({ name }: any) => {
        // @ts-ignore
        await puter.workers.delete(name);
        return `Worker '${name}' deleted.`;
    }
};

// --- 7. App Tools ---
const appTools = [
    {
        type: "function",
        function: {
            name: "app_create",
            description: "Create/Install a new Puter App pointing to a URL.",
            parameters: {
                type: "object",
                properties: {
                    name: { type: "string", description: "Unique app name" },
                    url: { type: "string", description: "The URL the app should load (e.g. index.html or external site)" },
                    title: { type: "string", description: "Human readable title" }
                },
                required: ["name", "url"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "app_list",
            description: "List all installed apps.",
            parameters: { type: "object", properties: {} }
        }
    },
    {
        type: "function",
        function: {
            name: "app_delete",
            description: "Uninstall/Delete an app.",
            parameters: {
                type: "object",
                properties: { name: { type: "string" } },
                required: ["name"]
            }
        }
    }
];

const appHandlers = {
    app_create: async ({ name, url, title }: any) => {
        // @ts-ignore
        const app = await puter.apps.create(name, url, title || name);
        return `App '${app.name}' created with UID: ${app.uid}`;
    },
    app_list: async () => {
        // @ts-ignore
        const apps = await puter.apps.list();
        if (apps.length === 0) return "No apps found.";
        return apps.map((a: any) => `${a.name} (${a.title}) -> ${a.index_url}`).join("\n");
    },
    app_delete: async ({ name }: any) => {
        // @ts-ignore
        await puter.apps.delete(name);
        return `App '${name}' deleted.`;
    }
};

// --- 8. User Tools ---
const userTools = [
    {
        type: "function",
        function: {
            name: "get_user_info",
            description: "Get current logged in user details.",
            parameters: { type: "object", properties: {} }
        }
    },
    {
        type: "function",
        function: {
            name: "get_resource_usage",
            description: "Get detailed cloud resource usage (AI credits, Storage, etc).",
            parameters: { type: "object", properties: {} }
        }
    }
];

const userHandlers = {
    get_user_info: async () => {
        const user = await puter.auth.getUser();
        return `User: ${user.username} (UUID: ${user.uuid})`;
    },
    get_resource_usage: async () => {
        // @ts-ignore
        const usage = await puter.auth.getMonthlyUsage();
        return JSON.stringify(usage.usage, null, 2);
    }
};

// --- Export Unified Lists ---

export const AGENT_TOOLS = [
    ...fsTools,
    ...hostingTools,
    ...kvTools,
    ...utilTools,
    ...aiTools,
    ...workerTools,
    ...appTools,
    ...userTools
];

export const AGENT_HANDLERS: Record<string, Function> = {
    ...fsHandlers,
    ...hostingHandlers,
    ...kvHandlers,
    ...utilHandlers,
    ...aiHandlers,
    ...workerHandlers,
    ...appHandlers,
    ...userHandlers
};