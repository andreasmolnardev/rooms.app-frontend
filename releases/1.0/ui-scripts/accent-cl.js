

export function AccentClSetter(newCl) {
    localStorage.setItem('accentCl', newCl);
      
}



export function AccentClGetter() {
   return localStorage.getItem('accentCl');
} 



