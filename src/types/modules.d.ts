declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '@vitejs/plugin-react' {
  const plugin: any;
  export default plugin;
}

