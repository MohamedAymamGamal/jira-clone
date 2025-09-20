"use client";

import React, { useEffect, useRef, useCallback } from "react";
import OrgChart from "@balkangraph/orgchart.js";

export default function OrgChartComponent() {
  const divRef = useRef<HTMLDivElement | null>(null);
  // chartRef kept as any because the library doesn't provide strong TS types here
  const chartRef = useRef<any>(null);

  // Function to parse URL parameters (equivalent to getOptions)
  const getOptions = useCallback(() => {
    const searchParams = new URLSearchParams(window.location.search);
    let fit = searchParams.get("fit");
    let scaleInitial = 1;
    if (fit === "yes") {
      scaleInitial = OrgChart.match.boundary;
    }
    return { scaleInitial };
  }, []);

  // Functions for node actions (memoized with useCallback)
  const addSharholder = useCallback((nodeId: any) => {
    chartRef.current?.addNode({
      id: OrgChart.randomId(),
      pid: nodeId,
      tags: ["menu-without-add"],
    });
  }, []);

  const addAssistant = useCallback((nodeId: any) => {
    const node = chartRef.current?.getNode(nodeId);
    if (!node) return;
    const data = {
      id: OrgChart.randomId(),
      pid: node.stParent.id,
      tags: ["assistant"],
    };
    chartRef.current?.addNode(data);
  }, []);

  const addDepartment = useCallback((nodeId: any) => {
    const node = chartRef.current?.getNode(nodeId);
    if (!node) return;
    const data = {
      id: OrgChart.randomId(),
      pid: node.stParent.id,
      tags: ["department"],
    };
    chartRef.current?.addNode(data);
  }, []);

  const addManager = useCallback((nodeId: any) => {
    chartRef.current?.addNode({ id: OrgChart.randomId(), stpid: nodeId });
  }, []);

  useEffect(() => {
    if (!divRef.current) return;

    // --- Templates (kept identical to your original) ---
    OrgChart.templates.ana = Object.assign({}, OrgChart.templates.base);
    OrgChart.templates.ana.size = [200, 150];
    OrgChart.templates.ana.node = `
      <rect filter="url(#sphera-shadow)" x="0" y="20" rx="8" ry="4" height="130" width="200" fill="#ffffff" stroke-width="2" stroke="#0ea5e9"></rect>
      <rect x="30" y="95" rx="15" ry="15" height="25" width="140" fill="#0ea5e9" stroke-width="2" stroke="#0ea5e9"></rect>
      <rect fill="#ffffff" stroke="#0ea5e9" stroke-width="2" x="75" y="0" rx="15" ry="15" width="50" height="50"></rect>
      <circle stroke="#f59e0b" stroke-width="3" fill="none" cx="100" cy="15" r="10"></circle>
      <path d="M80,40 C80,20 120,20 120,40" stroke="#f59e0b" stroke-width="3" fill="none"></path>
    `;
    OrgChart.templates.ana.defs = `
      <filter x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox" id="sphera-shadow">
        <feOffset dx="0" dy="4" in="SourceAlpha" result="shadowOffsetOuter1" />
        <feGaussianBlur stdDeviation="8" in="shadowOffsetOuter1" result="shadowBlurOuter1" />
        <feColorMatrix values="0 0 0 0 0.0745098039  0 0 0 0 0.4235294118  0 0 0 0 0.7058823529  0 0 0 0.3 0" in="shadowBlurOuter1" type="matrix" result="shadowMatrixOuter1" />
        <feMerge>
          <feMergeNode in="shadowMatrixOuter1" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    `;
    OrgChart.templates.ana.field_0 = `
      <text data-field="field_0" style="font-size:16px;font-weight:bold;" fill="#1e293b" x="100" y="70" text-anchor="middle">{val}</text>
    `;
    OrgChart.templates.ana.field_1 = `
      <text data-field="field_1" style="font-size:14px;" fill="white" x="100" y="112" text-anchor="middle">{val}</text>
    `;
    OrgChart.templates.ana.plus = `
      <circle cx="15" cy="15" r="15" fill="#ffffff" stroke="#aeaeae" stroke-width="1"></circle>
      <text text-anchor="middle" style="font-size: 18px;cursor:pointer;" fill="#757575" x="15" y="22">{collapsed-children-count}</text>
    `;
    OrgChart.templates.itTemplate = Object.assign(OrgChart.templates.ana);
    OrgChart.templates.itTemplate.nodeMenuButton = "";
    OrgChart.templates.itTemplate.nodeCircleMenuButton = {
      radius: 18,
      x: 180,
      y: 60,
      color: "#fff",
      stroke: "#aeaeae",
    };

    OrgChart.templates.invisibleGroup = Object.assign({}, OrgChart.templates.base);
    OrgChart.templates.invisibleGroup.padding = [20, 0, 0, 0];
    OrgChart.templates.invisibleGroup.node = "";
    OrgChart.templates.invisibleGroup.field_0 = "";
    OrgChart.templates.invisibleGroup.field_1 = "";

    // --- Initialize chart (keeps all your original options & nodes) ---
    const options = getOptions();
    chartRef.current = new OrgChart(divRef.current, {
      mouseScrool: OrgChart.action.scroll,
      scaleInitial: options.scaleInitial,
      enableSearch: false,
      template: "ana",
      enableDragDrop: true,
      assistantSeparation: 170,
      nodeCircleMenu: {
        details: {
          icon: OrgChart.icon.details(24, 24, "#aeaeae"),
          text: "Details",
          color: "white",
        },
        edit: {
          icon: OrgChart.icon.edit(24, 24, "#aeaeae"),
          text: "Edit node",
          color: "white",
        },
        add: {
          icon: OrgChart.icon.add(24, 24, "#aeaeae"),
          text: "Add node",
          color: "white",
        },
        remove: {
          icon: OrgChart.icon.remove(24, 24, "#aeaeae"),
          text: "Remove node",
          color: "#fff",
        },
        addLink: {
          icon: OrgChart.icon.link(24, 24, "#aeaeae"),
          text: "Add C link(drag and drop)",
          color: "#fff",
          draggable: true,
        },
      },
     
      nodeMenu: {
        details: { text: "Details" },
        edit: { text: "Edit" },
        add: { text: "Add" },
        remove: { text: "Delete" },
      },
      align: OrgChart.ORIENTATION,
      toolbar: {
        fullScreen: true,
        zoom: true,
        fit: true,
        expandAll: true,
      },
      nodeBinding: {
        field_0: "name",
        field_1: "title",
      },
      tags: {
        "top-management": {
          template: "invisibleGroup",
          subTreeConfig: {
            orientation: OrgChart.orientation.bottom,
            collapse: { level: 1 },
          },
        },
        "it-team": {
          subTreeConfig: {
            layout: OrgChart.mixed,
            collapse: { level: 1 },
          },
        },
        "hr-team": {
          subTreeConfig: {
            layout: OrgChart.treeRightOffset,
            collapse: { level: 1 },
          },
        },
        "sales-team": {
          subTreeConfig: {
            layout: OrgChart.treeLeftOffset,
            collapse: { level: 1 },
          },
        },
        "seo-menu": {
          nodeMenu: {
            addSharholder: {
              text: "Add new sharholder",
              icon: OrgChart.icon.add(24, 24, "#7A7A7A"),
              onClick: addSharholder,
            },
            addDepartment: {
              text: "Add new department",
              icon: OrgChart.icon.add(24, 24, "#7A7A7A"),
              onClick: addDepartment,
            },
            addAssistant: {
              text: "Add new assistant",
              icon: OrgChart.icon.add(24, 24, "#7A7A7A"),
              onClick: addAssistant,
            },
            edit: { text: "Edit" },
            details: { text: "Details" },
          },
        },
        "menu-without-add": {
          nodeMenu: {
            details: { text: "Details" },
            edit: { text: "Edit" },
            remove: { text: "Delete" },
          },
        },
        department: {
          template: "group",
          nodeMenu: {
            addManager: {
              text: "Add new manager",
              icon: OrgChart.icon.add(24, 24, "#7A7A7A"),
              onClick: addManager,
            },
            remove: { text: "Remove department" },
            edit: { text: "Edit department" },
            pdf_preview: { text: "Export department to PDF" },
          },
        },
        "it-team-member": {
          template: "itTemplate",
        },
      },
      clinks: [{ from: 11, to: 18 }],
      nodes: [
        { id: "top-management", tags: ["top-management"] },
        {
          id: "hr-team",
          pid: "top-management",
          tags: ["hr-team", "department"],
          name: "HR Department",
        },
        {
          id: "it-team",
          pid: "top-management",
          tags: ["it-team", "department"],
          name: "IT Department",
        },
        {
          id: "sales-team",
          pid: "top-management",
          tags: ["sales-team", "department"],
          name: "Sales Department",
        },
        {
          id: 1,
          stpid: "top-management",
          name: "Nicky Phillips",
          title: "CEO",
          tags: ["seo-menu"],
        },
        {
          id: 2,
          pid: 1,
          name: "Rowan Hall",
          title: "Shareholder (51%)",
          tags: ["menu-without-add"],
        },
        {
          id: 3,
          pid: 1,
          name: "Danni Anderson",
          title: "Shareholder (49%)",
          tags: ["menu-without-add"],
        },
        {
          id: 4,
          stpid: "hr-team",
          name: "Jordan Harris",
          title: "HR Manager",
        },
        {
          id: 5,
          pid: 4,
          name: "Emerson Adams",
          title: "Senior HR",
        },
        {
          id: 6,
          pid: 4,
          name: "Kai Morgan",
          title: "Junior HR",
        },
        {
          id: 7,
          stpid: "it-team",
          name: "Cory Robbins",
          tags: ["it-team-member"],
          title: "Core Team Lead",
        },
        {
          id: 8,
          pid: 7,
          name: "Billie Roach",
          tags: ["it-team-member"],
          title: "Backend Senior Developer",
        },
        {
          id: 9,
          pid: 7,
          name: "Maddox Hood",
          tags: ["it-team-member"],
          title: "C# Developer",
        },
        {
          id: 10,
          pid: 7,
          name: "Sam Tyson",
          tags: ["it-team-member"],
          title: "Backend Junior Developer",
        },
        {
          id: 11,
          stpid: "it-team",
          name: "Lynn Fleming",
          tags: ["it-team-member"],
          title: "UI Team Lead",
        },
        {
          id: 12,
          pid: 11,
          name: "Jo Baker",
          tags: ["it-team-member"],
          title: "JS Developer",
        },
        {
          id: 13,
          pid: 11,
          name: "Emerson Lewis",
          tags: ["it-team-member"],
          title: "Graphic Designer",
        },
        {
          id: 14,
          pid: 11,
          name: "Haiden Atkinson",
          tags: ["it-team-member"],
          title: "UX Expert",
        },
        {
          id: 15,
          stpid: "sales-team",
          name: "Tyler Chavez",
          title: "Sales Manager",
        },
        {
          id: 16,
          pid: 15,
          name: "Raylee Allen",
          title: "Sales",
        },
        {
          id: 17,
          pid: 15,
          name: "Kris Horne",
          title: "Sales Guru",
        },
        {
          id: 18,
          pid: "top-management",
          name: "Leslie Mcclain",
          title: "Personal Assistant",
          tags: ["assistant", "menu-without-add"],
        },
      ],
    });

    // --- Node circle menu click handler (safe checks) ---
    if (chartRef.current?.nodeCircleMenuUI) {
      chartRef.current.nodeCircleMenuUI.on("click", (sender: any, args: any) => {
        switch (args.menuItem.text) {
          case "Details":
            chartRef.current.editUI.show(args.nodeId, true);
            break;
          case "Add node":
            const id = chartRef.current.generateId ? chartRef.current.generateId() : OrgChart.randomId();
            chartRef.current.addNode({
              id,
              pid: args.nodeId,
              tags: ["it-team-member"],
            });
            break;
          case "Edit node":
            chartRef.current.editUI.show(args.nodeId);
            break;
          case "Remove node":
            chartRef.current.removeNode(args.nodeId);
            break;
          default:
            break;
        }
      });

      // Node circle menu drop handler
      chartRef.current.nodeCircleMenuUI.on("drop", (sender: any, args: any) => {
        chartRef.current.addClink(args.from, args.to).draw(OrgChart.action.update);
      });
    }

    // --- Other chart event handlers (kept as original) ---
    chartRef.current.on("added", (sender: any, id: any) => {
      sender.editUI.show(id);
    });

    chartRef.current.on("drop", (sender: any, draggedNodeId: any, droppedNodeId: any) => {
      const draggedNode = sender.getNode(draggedNodeId);
      const droppedNode = sender.getNode(droppedNodeId);
      if (droppedNode !== undefined) {
        if (
          droppedNode.tags.indexOf("department") !== -1 &&
          draggedNode.tags.indexOf("department") === -1
        ) {
          const draggedNodeData = sender.get(draggedNode.id);
          draggedNodeData.pid = null;
          draggedNodeData.stpid = droppedNode.id;
          sender.updateNode(draggedNodeData);
          return false;
        }
      }
    });

    chartRef.current.on("exportstart", (sender: any, args: any) => {
      const styles = document.getElementById("myStyles");
      if (styles) {
        args.styles = styles.outerHTML;
      }
    });

    chartRef.current.on("click", (sender: any, args: any) => {
      if (args.name === "edit") alert(`Edit clicked for node ${args.node.id}`);
      if (args.name === "remove") alert(`Delete clicked for node ${args.node.id}`);
    });

    // Optional: tweak edit form header when it opens (safe)
    chartRef.current.on?.("editUIShown", (sender: any, args: any) => {
      try {
        const header = document.querySelector(".boc-edit-form-header");
        if (header) {
          header.textContent = `Edit: ${args?.node?.name ?? "Node"}`;
        }
      } catch (e) {
        // silently fail if DOM structure differs
      }
    });

    // Cleanup on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [getOptions, addSharholder, addAssistant, addDepartment, addManager]);

  return (
    <div className="org-chart-container">
      <h1>Organization Structure</h1>
      <p className="subtitle">Company Departments and Teams</p>
      <style id="myStyles">
        {`
          .org-chart-container {
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
          }
          .org-chart-container h1 {
            font-size: 24px;
            font-weight: 600;
            color: #1e293b;
            text-align: center;
            margin-bottom: 10px;
          }
          .org-chart-container .subtitle {
            font-size: 16px;
            color: #64748b;
            text-align: center;
            margin-bottom: 20px;
          }
          .legend {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 20px;
          }
          .legend-item {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .color-box {
            width: 20px;
            height: 20px;
            border-radius: 4px;
          }
          .color-box.head-office {
            background-color: #0ea5e9;
          }
          .color-box.department {
            background-color: #f59e0b;
          }
          .color-box.team {
            background-color: #10b981;
          }
        `}
      </style>
      <div
        ref={divRef}
        style={{
          width: "100%",
          height: "600px",
          background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
          border: "1px solid #cbd5e1",
          borderRadius: "12px",
          boxSizing: "border-box",
          marginTop: "20px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
        }}
      />
      <div className="legend">
        <div className="legend-item">
          <div className="color-box head-office"></div>
          <span>Top Management</span>
        </div>
        <div className="legend-item">
          <div className="color-box department"></div>
          <span>Department</span>
        </div>
        <div className="legend-item">
          <div className="color-box team"></div>
          <span>Team</span>
        </div>
      </div>
    </div>
  );
}
