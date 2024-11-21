export function mutationObserverQuickadd(target, callback, config) {
    
    const observer = new MutationObserver(callback);

    if (config) {
        observer.observe(target, config);
    } else {
        observer.observe(target);
    }

}