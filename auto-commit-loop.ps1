# PowerShell Script สำหรับ Auto Commit ทุก 30 วินาที

Write-Host "เริ่มต้น Auto Commit ทุก 30 วินาที..."
Write-Host "กด Ctrl+C เพื่อหยุดการทำงาน"

# วนลูปตลอดไป
while ($true) {
    # เวลาปัจจุบัน
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    
    # ไปที่ไดเรกทอรีโปรเจค
    Set-Location -Path "D:\FinalProject\Face-Socail"
    
    # เพิ่มไฟล์ทั้งหมดเข้า git staging
    git add .
    
    # ตรวจสอบว่ามีการเปลี่ยนแปลงหรือไม่
    $changes = git status --porcelain
    
    if ($changes) {
        Write-Host "[$timestamp] พบการเปลี่ยนแปลง กำลัง commit และ push..."
        
        # Commit การเปลี่ยนแปลง
        git commit -m "Auto-commit at $timestamp"
        
        # Push ขึ้น GitHub
        git push origin main
        
        Write-Host "[$timestamp] Push เสร็จสิ้น!"
    } else {
        Write-Host "[$timestamp] ไม่พบการเปลี่ยนแปลง ข้ามการ commit"
    }
    
    # รอ 30 วินาที
    Start-Sleep -Seconds 30
}
