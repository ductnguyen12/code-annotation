declare module "scratch-vm" {
  declare class VirtualMachine {
    runtime: any;
    async loadProject(projectData: any);
    attachAudioEngine(engine: AudioEngine);
    addListener(event: string, handler: Function);
    removeListener(event: string, handler: Function);
    setEditingTarget(targetId: string);
    setCompatibilityMode(compatibilityModeOn: bool);
  }
  export default VirtualMachine;
}