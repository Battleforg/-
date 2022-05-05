# 常用git命令

## git pull
当使用```git pull -r```时，```-r```表示rebase，如果发现有冲突，立即用```git rebase --abort```来退出。然后再用stash或者切换到别的分支再cherrypick来解决冲突。