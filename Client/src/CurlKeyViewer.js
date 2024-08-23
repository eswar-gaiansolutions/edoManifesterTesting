// import React, { useState } from "react";
// import axios from "axios";
// import "./CurlExecutor.css"; // Import CSS for styling

// const CurlExecutor = () => {
//   const [curlInput, setCurlInput] = useState("");
//   const [response, setResponse] = useState(null);
//   const [keys, setKeys] = useState([]);
//   const [error, setError] = useState(null);

//   const parseCurlCommand = (curlCommand) => {
//     const curlObj = {
//       url: "",
//       method: "GET",
//       headers: {},
//       data: {}
//     };

//     const lines = curlCommand.split("\\\n");

//     lines.forEach((line) => {
//       if (line.includes("--location")) {
//         const urlMatch = line.match(/'(.*?)'/);
//         curlObj.url = urlMatch ? urlMatch[1] : "";
//       } else if (line.includes("--header")) {
//         const headerMatch = line.match(/--header '(.*?): (.*?)'/);
//         if (headerMatch) {
//           curlObj.headers[headerMatch[1]] = headerMatch[2];
//         }
//       } else if (line.includes("--data")) {
//         const dataMatch = line.match(/--data '(.*)'/);
//         if (dataMatch) {
//           curlObj.data = JSON.parse(dataMatch[1]);
//           curlObj.method = "POST";
//         }
//       }
//     });

//     return curlObj;
//   };
// // .......................get all keys.................
// const getAllKeys = (obj, prefix = '', keyMap = new Map()) => {
//     let keys = [];
    
//     for (const key in obj) {
//       if (obj.hasOwnProperty(key)) {
//         const prefixedKey = prefix ? `${prefix}.${key}` : key;
  
//         if (typeof obj[key] === 'object' && obj[key] !== null) {
//           if (Array.isArray(obj[key])) {
//             // Only consider the first element in the array for key extraction
//             keys.push(prefixedKey);  
//             if (obj[key].length > 0 && typeof obj[key][0] === 'object') {
//               keys = keys.concat(getAllKeys(obj[key][0], `${prefixedKey}[0]`, keyMap));
//             }
//           } else {
//             keys.push(prefixedKey);
//             keys = keys.concat(getAllKeys(obj[key], prefixedKey, keyMap));
//           }
//         } else {
//           keys.push(prefixedKey);
//         }
  
//         // Map the key to track the unique keys
//         if (!keyMap.has(prefixedKey)) {
//           keyMap.set(prefixedKey, 1);
//         } else {
//           keyMap.set(prefixedKey, keyMap.get(prefixedKey) + 1);
//         }
//       }
//     }
    
//     return keys;
//   };
  
  
  
//   const handleRunClick = async () => {
//     try {
//       const parsedCurl = parseCurlCommand(curlInput);
//       const response = await axios({
//         url: parsedCurl.url,
//         method: parsedCurl.method,
//         headers: parsedCurl.headers,
//         data: parsedCurl.data
//       });
//       const data = response.data;
//       setResponse(JSON.stringify(data, null, 2));
//       setKeys(getAllKeys(data));
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//       setResponse(null);
//       setKeys([]);
//     }
//   };

//   return (
//     <div className="curl-executor">
//       <textarea
//         className="curl-input"
//         value={curlInput}
//         onChange={(e) => setCurlInput(e.target.value)}
//         placeholder="Paste your curl command here..."
//       />
//       <button className="run-button" onClick={handleRunClick}>
//         Run
//       </button>
//       <div className="response-container">
//         <h3>Response:</h3>
//         <pre>{response ? response : "No response yet..."}</pre>
//         {error && <p className="error-message">{error}</p>}
//       </div>
//       <div className="keys-container">
//         <h3>Extracted Keys:</h3>
//         <ul>
//           {keys.length > 0 ? keys.map((key, index) => (
//             <li key={index}>{key}</li>
//           )) : <li>No keys extracted yet...</li>}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default CurlExecutor;
import React, { useState } from "react";
import axios from "axios";
import "./CurlExecutor.css"; // Import CSS for styling
import FlowMapping from "./FlowMapping";

const CurlExecutor = () => {
  const [curlInput, setCurlInput] = useState("");
  const [response, setResponse] = useState(null);
  const [keys, setKeys] = useState([]);
  const [error, setError] = useState(null);
  const [mappedData, setMappedData] = useState([]); // Updated to hold an array of mapped objects

  const parseCurlCommand = (curlCommand) => {
    const curlObj = {
      url: "",
      method: "GET",
      headers: {},
      data: {}
    };

    const lines = curlCommand.split("\\\n");

    lines.forEach((line) => {
      if (line.includes("--location")) {
        const urlMatch = line.match(/'(.*?)'/);
        curlObj.url = urlMatch ? urlMatch[1] : "";
      } else if (line.includes("--header")) {
        const headerMatch = line.match(/--header '(.*?): (.*?)'/);
        if (headerMatch) {
          curlObj.headers[headerMatch[1]] = headerMatch[2];
        }
      } else if (line.includes("--data")) {
        const dataMatch = line.match(/--data '(.*)'/);
        if (dataMatch) {
          curlObj.data = JSON.parse(dataMatch[1]);
          curlObj.method = "POST";
        }
      }
    });

    return curlObj;
  };

  const getAllKeys = (obj, prefix = '') => {
    let keys = [];
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const prefixedKey = prefix ? `${prefix}.${key}` : key;

        if (typeof obj[key] === 'object' && obj[key] !== null) {
          if (Array.isArray(obj[key])) {
            keys.push(prefixedKey);
            if (obj[key].length > 0 && typeof obj[key][0] === 'object') {
              keys = keys.concat(getAllKeys(obj[key][0], `${prefixedKey}[0]`));
            }
          } else {
            keys.push(prefixedKey);
            keys = keys.concat(getAllKeys(obj[key], prefixedKey));
          }
        } else {
          keys.push(prefixedKey);
        }
      }
    }
    
    return keys;
  };

  const handleRunClick = async () => {
    try {
      // const parsedCurl = parseCurlCommand(curlInput);
      // const response = await axios({
      //   url: parsedCurl.url,
      //   method: parsedCurl.method,
      //   headers: parsedCurl.headers,
      //   data: parsedCurl.data
      // });
      // const data = response.data;
      //Api response
      console.log("Hitting here");
      console.log(curlInput)
      // const response = await axios.post('http://localhost:3000/curl-to-response', {
      //   curlCommand: curlInput
      // });
      const response = await axios.post('http://localhost:3000/curl-to-response', 
        {
          curlCommand:curlInput
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        });
      console.log(response);
      const data = response;
      setResponse(JSON.stringify(data, null, 2));
      const extractedKeys = getAllKeys(data);
      setKeys(extractedKeys);
      setError(null);
    } catch (err) {
      setError(err.message);
      setResponse(null);
      setKeys([]);
    }
  };

  const mobiusKeys = [
    "Mobius_PI_Direct_time",
    "Mobius_PI_Direct_product_type",
    "Mobius_PI_Direct_user_type",
    "Mobius_PI_Direct_avg_cost",
    "Mobius_PI_Direct_storage_growth",
    "Mobius_PI_Direct_cost_fluctuation",
    // Add more Mobius keys here as needed
  ];
  const handleMappings = (mappings) => {
    if (response) {
      const parsedResponse = JSON.parse(response);
      const mappedResults = [];
  
      // Iterate over the mappings created by the user
      mappings.forEach(({ source, target }) => {
        // Get the value(s) from the response using the source key
        const values = getValuesByPath(parsedResponse, source);
  
        // Determine if the key's parent is an array and create objects accordingly
        values.forEach((value, index) => {
          const parentPath = getParentPath(source);
          const parentValue = getValuesByPath(parsedResponse, parentPath);
  
          if (Array.isArray(parentValue) && parentValue.length > 1) {
            if (!mappedResults[index]) {
              mappedResults[index] = {};
            }
            mappedResults[index][target] = value;
          } else {
            if (mappedResults.length === 0) {
              mappedResults.push({ [target]: value });
            } else {
              mappedResults[0][target] = value;
            }
          }
        });
      });
  
      setMappedData(mappedResults);
    }
  };
  
  // Extract the parent path from the source key
  const getParentPath = (path) => {
    const parts = path.split('.');
    parts.pop(); // Remove the last part (the key itself)
    return parts.join('.');
  };
  
  // Helper function to get values by a given path
  const getValuesByPath = (obj, path) => {
    const paths = path.replace(/\[(\w+)\]/g, '.$1').split('.');
    let current = obj;
    const values = [];
  
    const traverse = (o, i) => {
      if (i === paths.length) {
        values.push(o);
        return;
      }
  
      const key = paths[i];
      if (o && Array.isArray(o[key])) {
        o[key].forEach((item) => traverse(item, i + 1));
      } else if (o && o[key] !== undefined) {
        traverse(o[key], i + 1);
      }
    };
  
    traverse(current, 0);
    return values;
  };
  

  return (
    <><div>
      <div className="curl-executor">
        <textarea
          className="curl-input"
          value={curlInput}
          onChange={(e) => setCurlInput(e.target.value)}
          placeholder="Paste your curl command here..."
        />
        <button className="run-button" onClick={handleRunClick}>
          Run
        </button>
        <div className="response-container">
          <h3>Response:</h3>
          <pre>{response ? response : "No response yet..."}</pre>
          {error && <p className="error-message">{error}</p>}
        </div>
        <div className="keys-container">
          <h3>Extracted Keys:</h3>
          <ul>
            {keys.length > 0 ? keys.map((key, index) => (
              <li key={index}>{key}</li>
            )) : <li>No keys extracted yet...</li>}
          </ul>
        </div>
      </div>

      <FlowMapping 
        extractedKeys={keys} 
        mobiusKeys={mobiusKeys} 
        onMappingsChange={handleMappings} 
      />
     
      
    </div>

<div>

<div className="mapped-data-container">
{/* <h3>Mapped Final Schema Data:</h3> */}
{mappedData.map((data, index) => (
  <pre key={index}>{JSON.stringify(data, null, 2)}</pre>
))}
</div>

</div>

</>

  );
};

export default CurlExecutor;
