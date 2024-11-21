export async function fetchWord(word) {
    const corsProxy = 'https://corsproxy.io/?';
    let url = `${corsProxy}https://www.silbentrennung24.de/?term=${word}`;

    try {
        while (true) {
            // Fetch the content
            const response = await fetch(url, {
                redirect: 'manual' // Prevent automatic redirect handling
            });

            // Check if the response status indicates a redirect (3xx)
            if (response.status >= 300 && response.status < 400) {
                // Get the 'Location' header to find the new URL
                const location = response.headers.get('Location');
                if (!location) {
                    throw new Error('Redirection location not found');
                }

                // Prepend the CORS proxy to the new URL
                url = `${corsProxy}https://www.silbentrennung24.de/wort/${word}`;
                continue; // Retry fetching with the new URL
            }

            if (!response.ok) {
                throw new Error('Failed to retrieve the page');

            }

            const htmlText = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');
            const element = doc.getElementById('termresult');

            if (element) {
                return element.innerHTML;
            } else {
                throw new Error('Element with ID "termresult" not found');
            }
        }
    } catch (error) {
        return `Error: ${error.message}`;
    }
}
