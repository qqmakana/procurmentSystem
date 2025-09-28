import React, { useState } from 'react';
import { TabProps, LineItem } from '../types';

const TabDetails: React.FC<TabProps> = ({ requisition, updateRequisition }) => {
  const [newLineItem, setNewLineItem] = useState<Partial<LineItem>>({
    description: '',
    quantity: 1,
    unitPrice: 0
  });

  const addLineItem = () => {
    const testItem = {
      id: `item-${Date.now()}`,
      description: 'Test Item',
      quantity: 1,
      unitPrice: 100,
      totalAmount: 100
    };
    updateRequisition({
      lineItems: [...requisition.lineItems, testItem],
      totalAmount: requisition.totalAmount + 100
    });
  };

  return (
    <div style={{ padding: '20px', backgroundColor: 'black', color: 'white', minHeight: '100vh' }}>
      {/* HUGE OBVIOUS TEST */}
      <div style={{ 
        backgroundColor: 'red', 
        color: 'white', 
        padding: '20px', 
        margin: '20px 0',
        textAlign: 'center',
        fontSize: '24px',
        fontWeight: 'bold'
      }}>
        🚨 TABDETAILS IS WORKING! 🚨
      </div>

      {/* HUGE ADD ITEM BUTTON */}
      <div style={{ 
        backgroundColor: 'yellow', 
        color: 'black', 
        padding: '30px', 
        margin: '20px 0',
        textAlign: 'center',
        borderRadius: '15px'
      }}>
        <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>
          🛒 ADD ITEM BUTTON
        </h2>
        <button 
          onClick={addLineItem}
          style={{
            backgroundColor: 'white',
            color: 'black',
            padding: '25px 50px',
            fontSize: '28px',
            border: 'none',
            borderRadius: '15px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}
        >
          🛒 ADD NEW ITEM
        </button>
        <p style={{ marginTop: '20px', fontSize: '20px' }}>
          Click this button to add a test item to your requisition
        </p>
      </div>

      {/* CURRENT LINE ITEMS */}
      {requisition.lineItems.length > 0 && (
        <div style={{ 
          backgroundColor: 'green', 
          color: 'white', 
          padding: '20px', 
          margin: '20px 0',
          borderRadius: '10px'
        }}>
          <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>
            Current Line Items ({requisition.lineItems.length})
          </h3>
          {requisition.lineItems.map((item, index) => (
            <div key={item.id} style={{ 
              backgroundColor: 'white', 
              color: 'black', 
              padding: '15px', 
              margin: '10px 0',
              borderRadius: '8px'
            }}>
              <p><strong>Item {index + 1}:</strong> {item.description}</p>
              <p>Quantity: {item.quantity} | Price: R{item.unitPrice} | Total: R{item.totalAmount}</p>
            </div>
          ))}
          <p style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '15px' }}>
            Total Amount: R{requisition.totalAmount}
          </p>
        </div>
      )}

      {/* BASIC FORM */}
      <div style={{ 
        backgroundColor: 'black', 
        border: '2px solid white', 
        padding: '20px', 
        margin: '20px 0',
        borderRadius: '10px'
      }}>
        <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>Requisition Details</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Title:
          </label>
          <input
            type="text"
            value={requisition.title}
            onChange={(e) => updateRequisition({ title: e.target.value })}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'black',
              color: 'white',
              border: '1px solid white',
              borderRadius: '5px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Requester:
          </label>
          <input
            type="text"
            value={requisition.requester}
            onChange={(e) => updateRequisition({ requester: e.target.value })}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'black',
              color: 'white',
              border: '1px solid white',
              borderRadius: '5px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Justification:
          </label>
          <textarea
            value={requisition.justification}
            onChange={(e) => updateRequisition({ justification: e.target.value })}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'black',
              color: 'white',
              border: '1px solid white',
              borderRadius: '5px',
              height: '80px'
            }}
          />
        </div>
      </div>

      {/* LINE ITEMS FORM */}
      <div style={{ 
        backgroundColor: 'blue', 
        color: 'white', 
        padding: '20px', 
        margin: '20px 0',
        borderRadius: '10px'
      }}>
        <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>Add Line Item</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Description:
          </label>
          <input
            type="text"
            value={newLineItem.description || ''}
            onChange={(e) => setNewLineItem({...newLineItem, description: e.target.value})}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'white',
              color: 'black',
              border: '1px solid #ccc',
              borderRadius: '5px'
            }}
            placeholder="Item description..."
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Quantity:
            </label>
            <input
              type="number"
              value={newLineItem.quantity || ''}
              onChange={(e) => setNewLineItem({...newLineItem, quantity: parseInt(e.target.value) || 1})}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: 'white',
                color: 'black',
                border: '1px solid #ccc',
                borderRadius: '5px'
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Unit Price:
            </label>
            <input
              type="number"
              value={newLineItem.unitPrice || ''}
              onChange={(e) => setNewLineItem({...newLineItem, unitPrice: parseFloat(e.target.value) || 0})}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: 'white',
                color: 'black',
                border: '1px solid #ccc',
                borderRadius: '5px'
              }}
            />
          </div>
        </div>

        <button
          onClick={() => {
            if (!newLineItem.description || !newLineItem.quantity || !newLineItem.unitPrice) {
              alert('Please fill in all fields');
              return;
            }
            const lineItem = {
              id: `item-${Date.now()}`,
              description: newLineItem.description!,
              quantity: newLineItem.quantity!,
              unitPrice: newLineItem.unitPrice!,
              totalAmount: newLineItem.quantity! * newLineItem.unitPrice!
            };
            updateRequisition({
              lineItems: [...requisition.lineItems, lineItem],
              totalAmount: requisition.totalAmount + lineItem.totalAmount
            });
            setNewLineItem({ description: '', quantity: 1, unitPrice: 0 });
          }}
          style={{
            backgroundColor: 'white',
            color: 'black',
            padding: '15px 30px',
            fontSize: '18px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ➕ Add Item
        </button>
      </div>
    </div>
  );
};

export default TabDetails;