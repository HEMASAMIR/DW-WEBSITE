// Plain module (no 'use client') so the root layout can inline it into <head>.
// Runs before the page paints, so a saved English/German choice doesn't flash right-to-left.
export const LANG_BOOT_SCRIPT =
  "try{var l=localStorage.getItem('dw_lang');if(l==='en'||l==='de'){document.documentElement.lang=l;document.documentElement.dir='ltr';}}catch(e){}";
