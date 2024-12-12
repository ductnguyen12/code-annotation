import Box from '@mui/material/Box';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useMemo } from "react";
import VM from 'scratch-vm';

import VMScratchBlocks from '../lib/blocks';
import defineDynamicBlock from '../lib/define-dynamic-block';

const defaultOptions = {
  media: '/media/',
  readOnly: true,
  zoom: {
    controls: true,
    wheel: true,
    startScale: 0.5625,
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
  sprite,
}: {
  projectData?: any,
  style?: any,
  sprite?: string,
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

  const handleWorkspaceUpdate = useCallback((workspace: any) => debounce((data: any) => {
    console.log('workspaceUpdate', workspace);
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
  }, 100), [ScratchBlocks.Xml]);

  const handleExtensionAdded = useCallback((categoryInfo: any) => {
    console.log('EXTENSION_ADDED');
    const defineBlocks = (blockInfoArray: any[]) => {
      if (blockInfoArray && blockInfoArray.length > 0) {
        const staticBlocksJson: any[] = [];
        const dynamicBlocksInfo: any[] = [];
        blockInfoArray.forEach(blockInfo => {
          if (blockInfo.info && blockInfo.info.isDynamic) {
            dynamicBlocksInfo.push(blockInfo);
          } else if (blockInfo.json) {
            staticBlocksJson.push(blockInfo.json);
          }
          // otherwise it's a non-block entry such as '---'
        });

        ScratchBlocks.defineBlocksWithJsonArray(staticBlocksJson);
        dynamicBlocksInfo.forEach(blockInfo => {
          // This is creating the block factory / constructor -- NOT a specific instance of the block.
          // The factory should only know static info about the block: the category info and the opcode.
          // Anything else will be picked up from the XML attached to the block instance.
          const extendedOpcode = `${categoryInfo.id}_${blockInfo.info.opcode}`;
          const blockDefinition =
            defineDynamicBlock(ScratchBlocks, categoryInfo, blockInfo, extendedOpcode);
          ScratchBlocks.Blocks[extendedOpcode] = blockDefinition;
        });
      }
    };

    // scratch-blocks implements a menu or custom field as a special kind of block ("shadow" block)
    // these actually define blocks and MUST run regardless of the UI state
    defineBlocks(
      Object.getOwnPropertyNames(categoryInfo.customFieldTypes)
        .map(fieldTypeName => categoryInfo.customFieldTypes[fieldTypeName].scratchBlocksDefinition));
    defineBlocks(categoryInfo.menus);
    defineBlocks(categoryInfo.blocks);
  }, [ScratchBlocks]);

  const handleProjectLoaded = useCallback(debounce(() => {
    console.log('PROJECT_LOADED');
    const allTargets = vm.runtime.targets;
    const target = allTargets.find((t: any) => t.sprite.name === sprite);
    if (target) {
      console.log(target);
      vm.setEditingTarget(target.id);
    }
  }, 100), [vm]);

  const attachVM = useCallback((workspace: any) => {
    vm.addListener('workspaceUpdate', handleWorkspaceUpdate(workspace));
    vm.addListener('EXTENSION_ADDED', handleExtensionAdded);
    vm.runtime.addListener('PROJECT_LOADED', handleProjectLoaded);
    console.log('attach');
  }, [handleExtensionAdded, handleProjectLoaded, handleWorkspaceUpdate, vm]);

  const detachVM = useCallback((workspace: any) => {
    vm.removeListener('workspaceUpdate', handleWorkspaceUpdate(workspace));
    vm.removeListener('EXTENSION_ADDED', handleExtensionAdded);
    vm.runtime.removeListener('PROJECT_LOADED', handleProjectLoaded);
    console.log('detach');
  }, [handleExtensionAdded, handleProjectLoaded, handleWorkspaceUpdate, vm]);

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