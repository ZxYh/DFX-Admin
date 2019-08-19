function checkModulePermission (targetModuleName, permissions) {
  let hasPermission = false
  // console.log('targetModuleName: ', targetModuleName)
  // console.log('permissions: ', permissions)
  permissions.forEach((permission) => {
    const moduleName = permission.split('.')[0]
    // console.log('moduleName: ', moduleName)
    if (moduleName === targetModuleName) {
      hasPermission = true
    }
  })

  return hasPermission
}

export default {
  checkModulePermission
}
