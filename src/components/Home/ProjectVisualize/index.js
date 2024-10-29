import React, { useEffect, useState } from "react";
import Tree from "react-d3-tree";

function ProjectVisualize({ current }) {
  const [treeData, setTreeData] = useState(null);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        let url = current.url.split("/");
        url.pop();
        url.pop();
        url.push("descendants");
        url.push("");
        url = url.join("/");
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });
        const data = await response.json();
        setTreeData(data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchApi();
  }, [current]);

  const formatDataForTree = (data) => {
    return {
      name: data.title,
      children: data.children.map(formatDataForTree),
    };
  };

  const renderRectSvg = ({ nodeDatum }) => (
    <g>
      <rect width={100} height={40} fill="lightblue" stroke="black" />
      <text fill="black" strokeWidth="0" x={50} y={20} textAnchor="middle">
        {nodeDatum.name}
      </text>
    </g>
  );

  return (
    <div style={{ height: "500px", width: "100%" }}>
      {treeData && (
        <Tree
          data={formatDataForTree(treeData)}
          orientation="vertical"
          renderCustomNode={renderRectSvg}
          translate={{ x: 200, y: 50 }}
        />
      )}
    </div>
  );
}

export default ProjectVisualize;
