declare module "scratch-vm" {
  declare class VirtualMachine {
    runtime: any;
    async loadProject(projectData: any);
    addListener(event: string, handler: Function);
    removeListener(event: string, handler: Function);
    setEditingTarget(targetId: string);
  }
  export default VirtualMachine;
}