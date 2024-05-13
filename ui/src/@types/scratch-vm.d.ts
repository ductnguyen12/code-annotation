declare module "scratch-vm" {
  declare class VirtualMachine {
    blockListener: any;
    async loadProject(projectData: any);
    addListener(event: string, handler: Function);
    removeListener(event: string, handler: Function);
    clearFlyoutBlocks();
  }
  export default VirtualMachine;
}