export function compareVersion(v1, v2) {
       
        if (typeof v1 !== 'string' || typeof v2 !== 'string') {
           v1 =  v1.toString(); 
            v2 = v2.toString();
        }
    
       
        const v1Parts = v1.split('.');
        const v2Parts = v2.split('.');
        
       
        const k = Math.min(v1Parts.length, v2Parts.length);
        
        // Vergleiche die einzelnen Teile
        for (let i = 0; i < k; ++i) {
            const num1 = parseInt(v1Parts[i], 10);
            const num2 = parseInt(v2Parts[i], 10);
            
            if (num1 > num2) return 1;
            if (num1 < num2) return -1;
        }
        
        // Wenn beide Teile-Arrays gleich sind, gebe 0 zurück
        return v1Parts.length === v2Parts.length ? 0 : (v1Parts.length < v2Parts.length ? -1 : 1);
    }
    
