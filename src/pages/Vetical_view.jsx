import React, { useCallback, useEffect, useRef, useState } from 'react';
import { OrgChart } from 'd3-org-chart';
import axios from 'axios';

function VerticalTree() {
  const chartRef = useRef();
  const chartInstanceRef = useRef();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [detailsPopupOpen, setDetailsPopupOpen] = useState(false);
  const [familyData, setFamilyData] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      const isMobileDevice = window.innerWidth <= 576;
      setIsMobile(isMobileDevice);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Filter chart based on search
  const filterChart = useCallback(() => {
    if (!chartInstanceRef.current) return;
    
    chartInstanceRef.current.clearHighlighting();
    const data = chartInstanceRef.current.data();
    data.forEach((d) => (d._expanded = false));
    data.forEach((d) => {
      if (searchTerm && (
          d.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
          d.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.phone.toLowerCase().includes(searchTerm.toLowerCase())
        )) {
        d._highlighted = true;
        d._expanded = true;
      }
    });
    chartInstanceRef.current.data(data).render().fit();
  }, [searchTerm]);

  // Fit chart to screen
  const fitToScreen = useCallback(() => {
    if (!chartInstanceRef.current) return;
    
    if (isMobile) {
      chartInstanceRef.current
        .compact(true)
        .compactMarginBetween(() => 5)
        .compactMarginPair(() => 15)
        .neighbourMargin(() => 15)
        .nodeWidth(() => 120)
        .nodeHeight(() => 50)
        .render()
        .fit();
    } else {
      chartInstanceRef.current
        .compact(false)
        .compactMarginBetween(() => 35)
        .compactMarginPair(() => 70)
        .neighbourMargin(() => 100)
        .nodeWidth((d) => {
          if (d.depth === 0) return 250;
          if (d.depth === 1) return 220;
          return 180;
        })
        .nodeHeight(() => 70)
        .fit();
    }
  }, [isMobile]);

  // Chart control functions
  const expandAll = () => {
    if (chartInstanceRef.current) chartInstanceRef.current.expandAll().fit();
  };

  const collapseAll = () => {
    if (chartInstanceRef.current) chartInstanceRef.current.collapseAll().fit();
  };

  const showDetails = (nodeId) => {
    if (!chartInstanceRef.current) return;
    
    const node = chartInstanceRef.current.data().find(d => d._id === nodeId);
    if (!node) return;
    
    setSelectedMember(node);
    setDetailsPopupOpen(true);
  };

  // Register global functions for node interaction
  useEffect(() => {
    window.showDetails = showDetails;
    
    return () => {
      delete window.showDetails;
    };
  }, []);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://family-tree-backend-2.onrender.com/api/family-members');
        setFamilyData(response.data);
      } catch (error) {
        console.error("Error fetching family data:", error);
        // Use sample data if API fails
        setFamilyData([
          { _id: "1", firstName: "Root", lastName: "Member", parentId: "", phone: "123-456-7890" },
          { _id: "2", firstName: "Child", lastName: "One", parentId: "1", phone: "123-456-7891" },
          { _id: "3", firstName: "Child", lastName: "Two", parentId: "1", phone: "123-456-7892" }
        ]);
      }
    };
    
    fetchData();
  }, []);

  // Initialize the chart
  useEffect(() => {
    if (familyData.length > 0) {
      // Transform the data for vertical layout
      // Reverse parent-child relationships to achieve a vertical layout
      const dataFlattened = familyData.map(member => {
        // For vertical layout, we'll reverse the parent-child relationship
        // Children become parents, and parents become children
        const originalParentId = member.parentId || "";
        
        return {
          ...member,
          parentId: originalParentId,
          name: `${member.firstName} ${member.lastName}`,
          _directSubordinates: 0,
          _totalSubordinates: 0,
          _id: member._id
        };
      });
      
      // Calculate subordinates
      dataFlattened.forEach(node => {
        if (node.parentId) {
          const parent = dataFlattened.find(d => d._id === node.parentId);
          if (parent) {
            parent._directSubordinates = (parent._directSubordinates || 0) + 1;
            parent._totalSubordinates = (parent._totalSubordinates || 0) + 1;
          }
        }
      });
      
      // Apply rotation later via CSS
      const chart = new OrgChart()
        .container(chartRef.current)
        .data(dataFlattened)
        .nodeHeight((d) => isMobile ? 50 : 70)
        .nodeWidth((d) => isMobile ? 120 : d.depth === 0 ? 250 : d.depth === 1 ? 220 : 180)
        .onNodeClick(nodeData => showDetails(nodeData.data._id))
        .childrenMargin((d) => isMobile ? 20 : 50)
        .compactMarginBetween((d) => isMobile ? 5 : 35)
        .compactMarginPair((d) => isMobile ? 15 : 70)
        .neighbourMargin((a, b) => isMobile ? 15 : 100)
        // Set a vertical orientation by modifying the linkUpdate function
        .linkUpdate(function(d, i, arr) {
          const start = { "x": d.source.x, "y": d.source.y };
          const end = { "x": d.target.x, "y": d.target.y };

          const startY = start.y + d.source.height / 2;
          const startX = start.x + d.source.width / 2;
          const endY = end.y - d.target.height / 2;
          const endX = end.x + d.target.width / 2;

          // Basic path drawing for vertical tree
          return `M${startX},${startY} L${startX},${(startY + endY) / 2} L${endX},${(startY + endY) / 2} L${endX},${endY}`;
        })
        .buttonContent(({ node, state }) => {
          return `
          <div style="border-radius:3px;padding:3px;font-size:${isMobile ? '7px' : '10px'};margin:auto auto;background-color:lightgray"> <span style="font-size:${isMobile ? '6px' : '9px'}">${
            node.children
              ? `<i class="fas fa-chevron-up"></i>`
              : `<i class="fas fa-chevron-down"></i>`
          }</span> ${node.data._directSubordinates}  </div>`;
        })
        .nodeContent(function (d, i, arr, state) {
          const colors = ['#333333', '#555555', '#777777', '#999999'];
          const color = colors[d.depth % colors.length];
          const imageUrl = d.data.image || "http://res.cloudinary.com/djeajklvz/image/upload/c_auto,g_auto,h_200,w_200/v1/familyTree/16aq11ka";
          
          if (isMobile) {
            return `
              <div style="background-color:${color}; position:absolute;margin-top:-1px; margin-left:-1px;width:${d.width}px;height:${d.height}px;border-radius:7px;cursor:pointer;" onclick="showDetails('${d.data._id}')">
                <img src="${imageUrl}" style="position:absolute;margin-top:5px;margin-left:5px;border-radius:10px;width:40px;height:40px;" />
                
                <div style="color:#fafafa;font-size:${d.depth < 2 ? 10 : 8}px;font-weight:bold;margin-left:50px;margin-top:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:${d.width - 60}px;">
                  ${d.data.firstName} ${d.data.lastName}
                </div>
                <div style="color:#fafafa;font-size:8px;margin-left:50px;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:${d.width - 60}px;">
                  ${d.data.phone ? d.data.phone.substring(0, 10) + (d.data.phone.length > 10 ? '...' : '') : ''}
                </div>
              </div>
            `;
          } else {
            return `
              <div style="background-color:${color}; position:absolute;margin-top:-1px; margin-left:-1px;width:${d.width}px;height:${d.height}px;border-radius:7px;cursor:pointer;" onclick="showDetails('${d.data._id}')">
                <img src="${imageUrl}" style="position:absolute;margin-top:5px;margin-left:5px;border-radius:10px;width:60px;height:60px;" />
                
                <div style="color:#fafafa;font-size:${d.depth < 2 ? 16 : 12}px;font-weight:bold;margin-left:70px;margin-top:10px">
                  ${d.data.firstName} ${d.data.lastName}
                </div>
                <div style="color:#fafafa;margin-left:70px;margin-top:5px">
                  ${d.data.phone}
                </div>
              </div>
            `;
          }
        });

      chartInstanceRef.current = chart;
      chart.render();
      
      // Apply CSS to rotate the entire chart container
      const svgElement = chartRef.current.querySelector('svg');
      if (svgElement) {
        svgElement.style.transform = 'rotate(90deg)';
        svgElement.style.transformOrigin = 'center center';
      }
      
      // Apply initial fit to screen with a slight delay to ensure rendering
      setTimeout(() => {
        fitToScreen();
      }, 500);
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current = null;
      }
    };
  }, [familyData, isMobile, fitToScreen]);
 
  // For search functionality
  useEffect(() => {
    if (chartInstanceRef.current && searchTerm) {
      filterChart();
    }
  }, [searchTerm, filterChart]);

  // Re-apply fit to screen when the device type changes
  useEffect(() => {
    if (chartInstanceRef.current) {
      fitToScreen();
    }
  }, [isMobile, fitToScreen]);

  // Rotate chart on mount and when data changes
  useEffect(() => {
    // Apply CSS to rotate the entire chart container
    const svgElement = chartRef.current?.querySelector('svg');
    if (svgElement) {
      // For a vertical tree (rotate 90 degrees)
      svgElement.style.transform = 'rotate(90deg)';
      svgElement.style.transformOrigin = 'center center';
    }
  }, [familyData]);

  return (
    <div className="tree-container" style={{ width: '100%', overflow: 'hidden' }}>
      <div className={`controls ${isMobile ? 'mobile-controls' : ''}`} style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        gap: '8px',
        padding: '10px',
        flexWrap: isMobile ? 'nowrap' : 'wrap'
      }}>
        <input
          type="search"
          placeholder="Search by name or phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            flex: isMobile ? '1' : '1 1 200px',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: isMobile ? '14px' : '16px'
          }}
        />
        <div style={{ 
          display: 'flex', 
          gap: '8px',
          flexDirection: 'row',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={fitToScreen}
            style={{ 
              flex: '1',
              padding: '8px 12px',
              backgroundColor: '#278B8D',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: isMobile ? '14px' : '16px'
            }}
          >
            Fit to Screen
          </button>
          <button 
            onClick={expandAll}
            style={{ 
              flex: '1',
              padding: '8px 12px',
              backgroundColor: '#0C5C73',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: isMobile ? '14px' : '16px'
            }}
          >
            Expand All
          </button>
          <button 
            onClick={collapseAll}
            style={{ 
              flex: '1',
              padding: '8px 12px',
              backgroundColor: '#33C6CB',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: isMobile ? '14px' : '16px'
            }}
          >
            Collapse All
          </button>
        </div>
      </div>
      
      <div 
        className="chart-container" 
        ref={chartRef}
        style={{ 
          height: isMobile ? '600px' : '1200px', 
          backgroundColor: '#fffeff',
          width: '100%',
          overflowX: 'auto',
          overflowY: 'auto',
          touchAction: 'none',
          position: 'relative'
        }}
      />
      
      {/* Details Dialog */}
      {detailsPopupOpen && selectedMember && (
        <div style={{ 
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          zIndex: 1500,
          maxWidth: '90%',
          width: isMobile ? '95%' : '500px'
        }}>
          <h2 style={{ fontSize: isMobile ? '18px' : '24px' }}>
            {selectedMember.firstName} {selectedMember.lastName}
          </h2>
          <div style={{ marginBottom: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ padding: isMobile ? '6px' : '8px', fontWeight: 'bold', fontSize: isMobile ? '14px' : '16px' }}>Relationship:</td>
                  <td style={{ padding: isMobile ? '6px' : '8px', fontSize: isMobile ? '14px' : '16px' }}>{selectedMember.relationship || 'Not specified'}</td>
                </tr>
                <tr>
                  <td style={{ padding: isMobile ? '6px' : '8px', fontWeight: 'bold', fontSize: isMobile ? '14px' : '16px' }}>Gender:</td>
                  <td style={{ padding: isMobile ? '6px' : '8px', fontSize: isMobile ? '14px' : '16px' }}>{selectedMember.gender || 'Not specified'}</td>
                </tr>
                <tr>
                  <td style={{ padding: isMobile ? '6px' : '8px', fontWeight: 'bold', fontSize: isMobile ? '14px' : '16px' }}>Phone:</td>
                  <td style={{ padding: isMobile ? '6px' : '8px', fontSize: isMobile ? '14px' : '16px' }}>{selectedMember.phone || 'Not specified'}</td>
                </tr>
                <tr>
                  <td style={{ padding: isMobile ? '6px' : '8px', fontWeight: 'bold', fontSize: isMobile ? '14px' : '16px' }}>Notes:</td>
                  <td style={{ padding: isMobile ? '6px' : '8px', fontSize: isMobile ? '14px' : '16px', wordBreak: 'break-word' }}>{selectedMember.notes || 'None'}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ textAlign: 'right' }}>
            <button 
              onClick={() => setDetailsPopupOpen(false)}
              style={{ 
                padding: isMobile ? '6px 12px' : '8px 16px', 
                backgroundColor: '#278B8D', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer',
                fontSize: isMobile ? '14px' : '16px'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      {/* Instructions overlay for mobile users */}
      {isMobile && (
        <div 
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            right: '10px',
            padding: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            borderRadius: '8px',
            fontSize: '12px',
            textAlign: 'center',
            zIndex: 1000,
            pointerEvents: 'none',
            opacity: 0.8
          }}
        >
          Use two fingers to zoom in/out. Use one finger to drag the tree.
        </div>
      )}
    </div>
  );
}

export default VerticalTree;