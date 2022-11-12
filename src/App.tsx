import React, { useState } from 'react';

function App() {
  interface Provider {
    x: number;
    y: number;
    id: string;
  }
  const [activeTargets, setActiveTargets] = useState<Provider[]>([]);
  const [removedTargets, setremovedTargets] = useState<Provider[]>([]);

  // Dynamic targets list map
  const listTargets = activeTargets.map((target) => {
    return (
      <mark
        key={target.id}
        className={`absolute cursor-pointer w-[1px] h-[1px] bg-slate-200 after:absolute after:rounded-full after:origin-center after:-left-2 after:-top-2 after:w-4 after:h-4 after:bg-slate-700 after:animate-ping after:pointer-events-none`}
        style={{ left: `${target.x}px`, top: `${target.y}px` }}
      ></mark>
    );
  });

  function setNewTarget(e: React.MouseEvent) {
    let targetProperties = {
      x: e.clientX,
      y: e.clientY,
      id: e.clientX.toString() + e.clientY.toString(),
    };

    // Find matching active target index
    let getExistingTargetIndex = activeTargets.findIndex(
      (target) => target.id === targetProperties.id
    );

    // Check if active target index exists
    if (getExistingTargetIndex === -1) {
      // Target doesn't exist
      // Create new active target
      setActiveTargets((activeTargets) => [...activeTargets, targetProperties]);
    } else {
      // Target exists
      // Remove from activeTargets
      setActiveTargets((targets) =>
        targets.filter((target) => target.id !== targetProperties.id)
      );
      // Add to removedTargets
      setremovedTargets((activeTargets) => [
        ...activeTargets,
        targetProperties,
      ]);
    }
  }

  function undoLastTarget() {
    // Pull activeTargets array state
    const newActiveTargets = [...activeTargets];

    // Remove last active target
    const removedTarget = newActiveTargets.pop();

    // Return if array is empty
    if (!removedTarget) return;

    // Adjust state accordingly
    setremovedTargets([...removedTargets, removedTarget]);
    setActiveTargets([...newActiveTargets]);
  }

  function redoLastTarget() {
    // Pull existing removedTargets/activeTargets array states
    const newRemovedTargets = [...removedTargets];
    const newActiveTargets = [...activeTargets];

    // Remove last removed target
    const removedTarget = newRemovedTargets.pop();

    // Return if array is empty
    if (!removedTarget) return;

    // Add removed target back to active targets array
    newActiveTargets.push(removedTarget);

    // Adjust state accordingly
    setActiveTargets(newActiveTargets);
    setremovedTargets([...newRemovedTargets]);
  }

  return (
    <div className="App overflow-hidden">
      <div
        className="bg-gradient-to-b from-slate-900 to-black h-screen w-screen overflow-hidden"
        onClick={(e) => setNewTarget(e)}
      >
        {listTargets}
      </div>
      <div className="fixed flex justify-center font-bold rounded-lg -bottom-3 left-1/2 -translate-x-1/2 z-10 bg-slate-900 opacity-70 px-8 py-3 pb-6">
        <button
          className="text-lg uppercase rounded-lg bg-red-500 hover:bg-red-600 border-b-2 active:bg-red-700 active:border-b active:translate-y-[1px] border border-red-800 text-sm px-4 py-2 mr-2 transition-colors ease-in-out duration-50 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:active:bg-red-500 disabled:hover:bg-red-500 disabled:active:translate-y-[0] disabled:border-b-2"
          key="undo"
          onClick={undoLastTarget}
          disabled={activeTargets.length === 0}
        >
          Undo
        </button>
        <button
          className="text-lg uppercase rounded-lg bg-green-500 hover:bg-green-600 border-b-2 active:bg-green-700 active:border-b active:translate-y-[1px] border border-green-800 text-sm px-4 py-2 transition-colors ease-in-out duration-50 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:active:bg-green-500 disabled:hover:bg-green-500 disabled:active:translate-y-[0] disabled:border-b-2"
          key="redo"
          onClick={redoLastTarget}
          disabled={removedTargets.length === 0}
        >
          Redo
        </button>
      </div>
    </div>
  );
}

export default App;
