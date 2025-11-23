// Custom toast configuration with better styling
export const toastConfig = {
  duration: 3000,
  position: 'top-center',
  style: {
    background: 'rgba(16, 185, 129, 0.95)',
    color: '#fff',
    padding: '16px 24px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '500',
    marginTop: '40px', // Move down from titlebar
    marginLeft: '40px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  },
  // Custom styling for the toast container
  className: 'custom-toast',
};
