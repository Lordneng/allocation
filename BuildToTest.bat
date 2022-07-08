pushd %~dp0
cd Allocation-Model-App
node --max_old_space_size=64384 ./node_modules/@angular/cli/bin/ng build --prod
"%ProgramFiles%\WinRAR\rar.exe" a -agYYYY-MM-DD-HH:mm -cfg- -ep1 -inul -m5 -r -y "D:\Allocation-Model-App_.rar" "D:\Work\PTT\Project\Allocation-Model\Allocation-Model-App\dist\App\"
pause