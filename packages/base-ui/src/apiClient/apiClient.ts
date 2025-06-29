export const ApiClient = {
   
    async handleResponse(response: Response) {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }
        return response.text();
    },

    async get<T>(url: string): Promise<T> {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return this.handleResponse(response);
    },

    async post<T>(url: string, body?: any): Promise<T> {
        const isFormData = body instanceof FormData;
        const response = await fetch(url, {
            method: 'POST',
            headers: isFormData ? {} : {
                'Content-Type': 'application/json',
            },
            body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
        });
        return this.handleResponse(response);
    },

    async put<T>(url: string, body?: any): Promise<T> {
        const isFormData = body instanceof FormData;
        const response = await fetch(url, {
            method: 'PUT',
            headers: isFormData ? {} : {
                'Content-Type': 'application/json',
            },
            body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
        });
        return this.handleResponse(response);
    },

    async delete<T>(url: string): Promise<T> {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return this.handleResponse(response);
    }
};