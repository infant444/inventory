import React from 'react';
import Barcode from 'react-barcode-generator';

interface BarcodeComponentProps {
  value: string;
  width?: number;
  height?: number;
}

const BarcodeComponent: React.FC<BarcodeComponentProps> = ({ 
  value, 
  width = 1, 
  height = 25 
}) => {
  if (!value) return <span>-</span>;

  return (
    <div className="inline-block">
      <Barcode 
        value={value} 
        width={width}
        height={height}
        fontSize={8}
        textMargin={1}
        background="#ffffff"
        lineColor="#000000"
      />
    </div>
  );
};

export default BarcodeComponent;