import React from 'react';
import { DrivingSimulation } from './DrivingSimulation';

interface InDriveUIProps {
  tourId: string;
  isMultiplayer: boolean;
  onExit: () => void;
}



export const InDriveUI: React.FC<InDriveUIProps> = ({ tourId, isMultiplayer, onExit }) => {
  return <DrivingSimulation tourId={tourId} isMultiplayer={isMultiplayer} onExit={onExit} />;
};