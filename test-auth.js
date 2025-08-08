// Test script to verify authentication fix
const testAuth = async () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU0NzUwMzk2LCJpYXQiOjE3NTQ1Nzc1OTYsImp0aSI6ImVlYjJkNzQ0NTdhMDRjZWQ4NjI2YjE3MmFiNDY3MjI5IiwidXNlcl9pZCI6MjksImZpcnN0X25hbWUiOiJTSUJPTUFOQSIsImxhc3RfbmFtZSI6IkFscGhvbnNlIiwiZW1haWwiOiJzaWJvLmFscGhvbnNlZUBnbWFpbC5jb20iLCJwcm9maWxlX2lkIjoyMH0.ik6n6KDqKtazbDUNX7YNmbJ8Uff2y3rmng1QVGZPl_s";

    // Store token in localStorage
    localStorage.setItem("access", token);
    localStorage.setItem("refresh", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2MjM1MzU5NiwiaWF0IjoxNzU0NTc3NTk2LCJqdGkiOiI1NWIzNGRjOGE1OGI0ZjcwYWE0YjU5NmE4NDA0NmJjMiIsInVzZXJfaWQiOjI5fQ.DR6acr5rhEKl2lCWksm0j55nGocBTkFsvFxInPBVfNw");

    // Reload the page to trigger auth initialization
    window.location.reload();
};

// Execute the test
testAuth();
