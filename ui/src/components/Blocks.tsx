import Box from '@mui/material/Box';
import { useCallback, useEffect, useMemo } from "react";
import VM from 'scratch-vm';
import VMScratchBlocks from '../lib/blocks';

const defaultOptions = {
  media: '/media/',
  readOnly: true,
  zoom: {
    controls: true,
    wheel: true,
    startScale: 0.675,
  },
  grid: {
    spacing: 40,
    length: 2,
    colour: '#ddd'
  },
  comments: false,
  collapse: false,
  scrollbars: true,
  sounds: false
};

export default function Blocks({
  projectData,
  style,
}: {
  projectData?: any,
  style?: any,
}) {
  let ref: any = null;
  const setRef = (el: any) => ref = el;

  const vm = useMemo(() => {
    console.log('new VM');

    return new VM();
  }, []);

  const ScratchBlocks = useMemo(() => {
    if (!vm)
      return undefined;
    console.log('new Blocks');
    const blocks = VMScratchBlocks(vm);
    return blocks;
  }, [vm]);

  const onWorkspaceUpdate = useCallback((workspace: any) => (data: any) => {
    console.log('onWorkspaceUpdate');
    // Remove and reattach the workspace listener (but allow flyout events)
    workspace.removeChangeListener(vm.blockListener);
    const dom = ScratchBlocks.Xml.textToDom(data.xml);
    try {
      ScratchBlocks.Xml.clearWorkspaceAndLoadFromXml(dom, workspace);
    } catch (error: any) {
      // The workspace is likely incomplete. What did update should be
      // functional.
      //
      // Instead of throwing the error, by logging it and continuing as
      // normal lets the other workspace update processes complete in the
      // gui and vm, which lets the vm run even if the workspace is
      // incomplete. Throwing the error would keep things like setting the
      // correct editing target from happening which can interfere with
      // some blocks and processes in the vm.
      if (error.message) {
        error.message = `Workspace Update Error: ${error.message}`;
      }
      console.error(error);
    }
    workspace.addChangeListener(vm.blockListener);

    // Clear the undo state of the workspace since this is a
    // fresh workspace and we don't want any changes made to another sprites
    // workspace to be 'undone' here.
    workspace.clearUndo();
  }, [ScratchBlocks.Xml, vm.blockListener]);

  const attachVM = useCallback((workspace: any) => {
    workspace.addChangeListener(vm.blockListener);
    vm.addListener('workspaceUpdate', onWorkspaceUpdate(workspace));
    console.log('attach');
  }, [onWorkspaceUpdate, vm]);

  const detachVM = useCallback((workspace: any) => {
    vm.removeListener('workspaceUpdate', onWorkspaceUpdate(workspace));
    console.log('detach');
  }, [onWorkspaceUpdate, vm]);

  useEffect(() => {
    if (!projectData)
      return;
    console.log('Load VM');

    vm.loadProject(projectData)
      .catch((e: any) => {
        console.error(e);
      });
  }, [projectData, vm]);

  useEffect(() => {
    if (!ref || !ScratchBlocks)
      return;
    const workspaceConfig = defaultOptions;
    console.log('Inject')
    const workspace = ScratchBlocks.inject(ref, workspaceConfig);
    attachVM(workspace);
    return () => {
      console.log('workspace.dispose()');
      detachVM(workspace);
      workspace.dispose();
      vm.clearFlyoutBlocks();
    }
  }, [ScratchBlocks, attachVM, detachVM, ref, vm]);

  return (
    <Box
      style={style || {
        height: '100vh',
      }}
      ref={setRef}
    />
  )
}