#!/bin/bash
# Script to automatically commit and push changes

# รับข้อความ commit จาก parameter หรือใช้ค่าเริ่มต้น
COMMIT_MSG=${1:-"Auto-commit: Updated files"}

# ตรวจสอบการเปลี่ยนแปลง
git add .
git status --porcelain

# ถ้ามีการเปลี่ยนแปลง ให้ commit และ push
if [ -n "$(git status --porcelain)" ]; then
  echo "Changes detected. Committing and pushing..."
  git commit -m "$COMMIT_MSG"
  # post-commit hook จะทำการ push โดยอัตโนมัติ
else
  echo "No changes detected. Nothing to commit."
fi
