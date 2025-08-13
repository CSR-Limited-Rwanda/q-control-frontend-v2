#!/bin/bash

# This script replaces window.customToast calls with state-based message handlers
# Usage: ./replace-toast.sh

# Define the project directory
PROJECT_DIR="/Users/aphonse/Desktop/projects/quality-control/q-control-frontend-v2/src"

# Find all .jsx and .js files that contain window.customToast
echo "Finding files with window.customToast..."
FILES_WITH_TOAST=$(grep -r "window.customToast" "$PROJECT_DIR" --include="*.jsx" --include="*.js" | cut -d: -f1 | sort | uniq)

echo "Files containing window.customToast:"
echo "$FILES_WITH_TOAST"

echo ""
echo "You need to manually update each file by:"
echo "1. Adding: const [errorMessage, setErrorMessage] = useState(\"\");"
echo "2. Adding: const [successMessage, setSuccessMessage] = useState(\"\");"
echo "3. Adding: import MessageDisplay from '@/components/MessageDisplay';"
echo "4. Replacing window.customToast.success('message') with: setErrorMessage(''); setSuccessMessage('message');"
echo "5. Replacing window.customToast.error('message') with: setSuccessMessage(''); setErrorMessage('message');"
echo "6. Adding <MessageDisplay errorMessage={errorMessage} successMessage={successMessage} onClearError={() => setErrorMessage('')} onClearSuccess={() => setSuccessMessage('')} /> in the JSX"
