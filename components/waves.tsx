import { FC } from "react";
import { Wave } from "../utils/wave.interface";

interface Props {
  waves: Wave[];
}

const Waves: FC<Props> = ({ waves }) => {
  return (
    <ul role="list" className="divide-y divide-gray-200">
      {waves.map((wave, index) => (
        <li key={index} className="py-4">
          <div className="flex space-x-3">
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">from: {wave.address}</h3>
                <p className="text-sm text-gray-500">
                  {wave.timestamp.toString()}
                </p>
              </div>
              <p className="text-sm text-gray-500">{wave.message}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Waves;
