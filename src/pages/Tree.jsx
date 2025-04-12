import React, { useCallback, useEffect, useRef, useState } from 'react';
import { OrgChart } from 'd3-org-chart';
import { TreeContext } from '../Context/TreeContext';
import { useContext } from 'react';
import FamilyMemberForm from '../components/Form';
import { Dialog } from '@mui/material';
import axios from 'axios';
function Tree() {
  const [formOpen, setFormOpen] = useState(false);
  const chartRef = useRef();
  const chartInstanceRef = useRef();
  // eslint-disable-next-line
  const { flag } = useContext(TreeContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [detailsPopupOpen, setDetailsPopupOpen] = useState(false);
  const [familyData, setFamilyData] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Define all functions at the top
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

  const fitToScreen = useCallback(() => {
    if (!chartInstanceRef.current) return;
    
    // For mobile, apply additional scaling and positioning
    if (isMobile) {
      // const containerWidth = chartRef.current.clientWidth;
      // const containerHeight = chartRef.current.clientHeight;
      
      // Adjust the scale based on screen size
      chartInstanceRef.current
        .compactMarginBetween(() => 15)
        .compactMarginPair(() => 30)
        .neighbourMargin(() => 40)
        .nodeWidth(() => isMobile ? 150 : 180)
        .fit()
        .render();
    } else {
      chartInstanceRef.current.fit();
    }
  }, [isMobile]);

  const expandAll = () => {
    if (chartInstanceRef.current) chartInstanceRef.current.expandAll().fit();
  };

  const collapseAll = () => {
    if (chartInstanceRef.current) chartInstanceRef.current.collapseAll().fit();
  };

  const addNode = (parentId) => {
    if (!chartInstanceRef.current) return;
    
    const newNodeId = `emp-${Date.now()}`;
    const parentNode = chartInstanceRef.current.data().find(d => d._id === parentId);
    
    const newNode = {
      _id: newNodeId,
      parentId: parentId,
      firstName: "New",
      lastName: "Member",
      relationship: "other",
      gender: "other",
      phone: "+1234567890",
      imageUrl: "https://raw.githubusercontent.com/bumbeishvili/sample-data/main/images/empty-icon.png",
      _directSubordinates: 0,
      _totalSubordinates: 0
    };
    
    const data = chartInstanceRef.current.data();
    data.push(newNode);
    
    // Update parent's subordinate counts
    parentNode._directSubordinates = (parseInt(parentNode._directSubordinates) || 0) + 1;
    parentNode._totalSubordinates = (parseInt(parentNode._totalSubordinates) || 0) + 1;
    
    // Update and re-render the chart with new data
    chartInstanceRef.current.data(data).render();
  };

  const removeNode = (nodeId) => {
    if (!chartInstanceRef.current) return;
    
    // Don't allow removing the root node
    const nodeToRemove = chartInstanceRef.current.data().find(d => d._id === nodeId);
    if (!nodeToRemove || nodeToRemove.parentId === "") return;

    // Find all descendants of the node to remove
    const descendantIds = new Set();
    const findDescendants = (_id) => {
      chartInstanceRef.current.data().forEach(node => {
        if (node.parentId === _id) {
          descendantIds.add(node._id);
          findDescendants(node._id);
        }
      });
    };
    findDescendants(nodeId);
    descendantIds.add(nodeId);

    // Update parent's subordinate counts
    const parentNode = chartInstanceRef.current.data().find(d => d._id === nodeToRemove.parentId);
    if (parentNode) {
      parentNode._directSubordinates = Math.max(0, (parseInt(parentNode._directSubordinates) || 0) - 1);
      parentNode._totalSubordinates = Math.max(0, (parseInt(parentNode._totalSubordinates) || 0) - descendantIds.size);
    }

    // Remove the node and all its descendants
    const data = chartInstanceRef.current.data().filter(d => !descendantIds.has(d._id));

    // Update and re-render the chart with new data
    chartInstanceRef.current.data(data).render();
  };

  const editNode = (nodeId) => {
    if (!chartInstanceRef.current) return;
    
    const node = chartInstanceRef.current.data().find(d => d._id === nodeId);
    if (!node) return;
    
    setSelectedMember(node);
    setFormOpen(true);
  };

  const showDetails = (nodeId) => {
    if (!chartInstanceRef.current) return;
    
    console.log(nodeId);
    const node = chartInstanceRef.current.data().find(d => d._id === nodeId);
    if (!node) return;
    
    setSelectedMember(node);
    setDetailsPopupOpen(true);
  };

  // For manually registering window functions
  useEffect(() => {
    // Register the global functions
    window.addNode = addNode;
    window.removeNode = removeNode;
    window.editNode = editNode;
    window.showDetails = showDetails;

    return () => {
      // Clean up the global functions
      delete window.addNode;
      delete window.removeNode;
      delete window.editNode;
      delete window.showDetails;
    };
  }, []);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/family-members');
        console.log("Raw API response:", response);
        setFamilyData(response.data);
      } catch (error) {
        console.error("Error fetching family data:", error);
      }
    };
    
    fetchData();
  }, []);

  // Initialize the chart
  useEffect(() => {
    if (familyData.length > 0) {
      // Transform the data to include parentId properly
      const dataFlattened = familyData.map(member => {
        return {
          ...member,
          // If member doesn't have parentId, set it to empty string for root nodes
          parentId: member.parentId || "",
          name: `${member.firstName} ${member.lastName}`,
          _directSubordinates: 0,
          _totalSubordinates: 0,
          // Make sure to use the custom id field, not MongoDB's _id
          _id: member._id
        };
      });
      
      console.log("Transformed data for chart:", dataFlattened);
      
      // Calculate _directSubordinates and _totalSubordinates
      dataFlattened.forEach(node => {
        if (node.parentId) {
          const parent = dataFlattened.find(d => d._id === node.parentId);
          if (parent) {
            parent._directSubordinates = (parent._directSubordinates || 0) + 1;
            parent._totalSubordinates = (parent._totalSubordinates || 0) + 1;
          }
        }
      });
      
      const chart = new OrgChart()
        .container(chartRef.current)
        .data(dataFlattened)
        .nodeHeight((d) => isMobile ? 60 : 70)
        .nodeWidth((d) => {
          if (isMobile) {
            if (d.depth === 0) return 160;
            if (d.depth === 1) return 150;
            return 140;
          } else {
            if (d.depth === 0) return 250;
            if (d.depth === 1) return 220;
            return 180;
          }
        })
        .onNodeClick(nodeData => {
          console.log("Node clicked:", nodeData);
          showDetails(nodeData.data._id);
        })
        .childrenMargin((d) => isMobile ? 30 : 50)
        .compactMarginBetween((d) => isMobile ? 20 : 35)
        .compactMarginPair((d) => isMobile ? 40 : 70)
        .neighbourMargin((a, b) => isMobile ? 50 : 100)
        .buttonContent(({ node, state }) => {
          return `
          <div style="border-radius:3px;padding:3px;font-size:${isMobile ? '8px' : '10px'};margin:auto auto;background-color:lightgray"> <span style="font-size:${isMobile ? '7px' : '9px'}">${
            node.children
              ? `<i class="fas fa-chevron-up"></i>`
              : `<i class="fas fa-chevron-down"></i>`
          }</span> ${node.data._directSubordinates}  </div>`;
        })
        .nodeContent(function (d, i, arr, state) {
          const colors = ['#278B8D', '#404040', '#0C5C73', '#33C6CB'];
          const color = colors[d.depth % colors.length];
          if(!d.data.image){
            d.data.image = "http://res.cloudinary.com/djeajklvz/image/upload/c_auto,g_auto,h_200,w_200/v1/familyTree/16aq11ka";
          }
          if (isMobile) {
            
            return `
              <div style="background-color:${color}; position:absolute;margin-top:-1px; margin-left:-1px;width:${d.width}px;height:${d.height}px;border-radius:50px;cursor:pointer;" onclick="showDetails('${d.data._id}')">
                <img src="${d.data.image}" style="position:absolute;margin-top:5px;margin-left:5px;border-radius:100px;width:50px;height:50px;" />
                
                <div style="color:#fafafa;font-size:${d.depth < 2 ? 12 : 10}px;font-weight:bold;margin-left:60px;margin-top:10px">
                  ${d.data.firstName} ${d.data.lastName}
                </div>
                <div style="color:#fafafa;font-size:10px;margin-left:60px;margin-top:4px">
                  ${d.data.phone ? d.data.phone.substring(0, 10) + (d.data.phone.length > 10 ? '...' : '') : ''}
                </div>
              </div>
              ${flag === true ?
              `<div style="display:flex;flex-direction:column;position:absolute;right:-20px;top:50%;transform:translateY(-50%)">
                <div style="position:relative;left:-5px;cursor:pointer;background-color:rgba(0,0,0,0.2);padding:3px;border-radius:50%;" onclick="editNode('${d.data._id}')">
                  <i class="fas fa-edit" style="color:#000;font-size:10px;"></i>
                </div>
                <div style="position:relative;left:-5px;cursor:pointer;background-color:rgba(0,0,0,0.2);padding:3px;border-radius:50%;margin-top:2px;" onclick="removeNode('${d.data._id}')">
                  <i class="fas fa-minus" style="color:#000;font-size:10px;"></i>
                </div>
                <div style="position:relative;left:-5px;cursor:pointer;background-color:rgba(0,0,0,0.2);padding:3px;border-radius:50%;margin-top:2px;" onclick="addNode('${d.data._id}')">
                  <i class="fas fa-plus" style="color:#000;font-size:10px;"></i>
                </div>
              </div>` : ''
            }
            `;
          } else {
            return `
              <div style="background-color:${color}; position:absolute;margin-top:-1px; margin-left:-1px;width:${d.width}px;height:${d.height}px;border-radius:50px;cursor:pointer;" onclick="showDetails('${d.data._id}')">
                <img src="${d.data.image}" style="position:absolute;margin-top:5px;margin-left:5px;border-radius:100px;width:60px;height:60px;" />
                
                <div style="color:#fafafa;font-size:${d.depth < 2 ? 16 : 12}px;font-weight:bold;margin-left:70px;margin-top:15px">
                  ${d.data.firstName} ${d.data.lastName}
                </div>
                <div style="color:#fafafa;margin-left:70px;margin-top:5px">
                  ${d.data.phone}
                </div>
              </div>
              ${flag === true ?
              `<div style="display:flex;flex-direction:column;position:absolute;right:-25px;top:50%;transform:translateY(-50%)">
                <div style="position:relative;left:-8px;cursor:pointer;background-color:rgba(0,0,0,0.2);padding:5px;border-radius:50%;" onclick="editNode('${d.data._id}')">
                  <i class="fas fa-edit" style="color:#000;"></i>
                </div>
                <div style="position:relative;left:-2px;cursor:pointer;background-color:rgba(0,0,0,0.2);padding:5px;border-radius:50%;" onclick="removeNode('${d.data._id}')">
                  <i class="fas fa-minus" style="color:#000;"></i>
                </div>
                <div style="position:relative;left:-8px;cursor:pointer;background-color:rgba(0,0,0,0.2);padding:5px;border-radius:50%;" onclick="addNode('${d.data._id}')">
                  <i class="fas fa-plus" style="color:#000;"></i>
                </div>
              </div>` : ''
            }
            `;
          }
        });

      chartInstanceRef.current = chart;
      chart.render();
      
      // Apply initial fit to screen for current device
      setTimeout(() => {
        fitToScreen();
      }, 500);
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current = null;
      }
    };
  }, [familyData, isMobile,fitToScreen,flag]);
 

  // For search functionality
  useEffect(() => {
    if (chartInstanceRef.current && searchTerm) {
      filterChart();
    }
  }, [searchTerm,filterChart]);

  // Re-apply fit to screen when the device type changes
  useEffect(() => {
    if (chartInstanceRef.current) {
      fitToScreen();
    }
  }, [isMobile,fitToScreen,flag]);

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
          flexDirection: isMobile ? 'row' : 'row',
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
          height: isMobile ? '700px' : '1200px', 
          backgroundColor: '#fffeff',
          width: '100%',
          overflowX: 'auto',
          overflowY: 'auto',
          touchAction: 'pan-x pan-y'  // Enable touch panning
        }}
      />
      
      {/* Form Dialog */}
      <Dialog 
        open={formOpen} 
        onClose={() => setFormOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <FamilyMemberForm 
          initialData={selectedMember} 
          onClose={() => setFormOpen(false)} 
        />
      </Dialog>
      
      {/* Details Dialog */}
      <Dialog
        open={detailsPopupOpen}
        onClose={() => setDetailsPopupOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedMember && (
          <div style={{ padding: isMobile ? '15px' : '20px' }}>
            <h2 style={{ fontSize: isMobile ? '18px' : '24px' }}>
              {selectedMember.firstName} {selectedMember.lastName}
            </h2>
            <div style={{ marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: isMobile ? '6px' : '8px', fontWeight: 'bold', fontSize: isMobile ? '14px' : '16px' }}>Relationship:</td>
                    <td style={{ padding: isMobile ? '6px' : '8px', fontSize: isMobile ? '14px' : '16px' }}>{selectedMember.relationship}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: isMobile ? '6px' : '8px', fontWeight: 'bold', fontSize: isMobile ? '14px' : '16px' }}>Gender:</td>
                    <td style={{ padding: isMobile ? '6px' : '8px', fontSize: isMobile ? '14px' : '16px' }}>{selectedMember.gender}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: isMobile ? '6px' : '8px', fontWeight: 'bold', fontSize: isMobile ? '14px' : '16px' }}>Date of Birth:</td>
                    <td style={{ padding: isMobile ? '6px' : '8px', fontSize: isMobile ? '14px' : '16px' }}>{selectedMember.dateOfBirth}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: isMobile ? '6px' : '8px', fontWeight: 'bold', fontSize: isMobile ? '14px' : '16px' }}>Email:</td>
                    <td style={{ padding: isMobile ? '6px' : '8px', fontSize: isMobile ? '14px' : '16px', wordBreak: 'break-word' }}>{selectedMember.email}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: isMobile ? '6px' : '8px', fontWeight: 'bold', fontSize: isMobile ? '14px' : '16px' }}>Phone:</td>
                    <td style={{ padding: isMobile ? '6px' : '8px', fontSize: isMobile ? '14px' : '16px' }}>{selectedMember.phone}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: isMobile ? '6px' : '8px', fontWeight: 'bold', fontSize: isMobile ? '14px' : '16px' }}>Address:</td>
                    <td style={{ padding: isMobile ? '6px' : '8px', fontSize: isMobile ? '14px' : '16px', wordBreak: 'break-word' }}>{selectedMember.address}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: isMobile ? '6px' : '8px', fontWeight: 'bold', fontSize: isMobile ? '14px' : '16px' }}>Notes:</td>
                    <td style={{ padding: isMobile ? '6px' : '8px', fontSize: isMobile ? '14px' : '16px', wordBreak: 'break-word' }}>{selectedMember.notes}</td>
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
              <button 
                onClick={() => {
                  editNode(selectedMember._id);
                  setDetailsPopupOpen(false);
                }}
                style={{ 
                  padding: isMobile ? '6px 12px' : '8px 16px', 
                  backgroundColor: '#0C5C73', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  marginLeft: '10px', 
                  cursor: 'pointer',
                  fontSize: isMobile ? '14px' : '16px'
                }}
              >
                Edit
              </button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

export default Tree;