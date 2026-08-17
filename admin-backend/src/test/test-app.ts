// Helper function because app keeps missing in test?
let app: any;

export function setApp(instance: any) {
  app = instance;
}

export function getApp() {
  return app;
}