@@ .. @@
   activeEvent: Event | null;
   isRunning: boolean;
   speed: number;
+  dataQuality: {
+    score: number;
+    lastCheck: Date | null;
+    issuesCount: number;
+  };
 }
 
 type SimulationAction =
@@ .. @@
   | { type: 'SET_SPEED'; payload: number }
   | { type: 'ADD_EVENT'; payload: Event }
   | { type: 'SET_ACTIVE_EVENT'; payload: Event | null }
+  | { type: 'UPDATE_DATA'; payload: { stores?: any[]; distributionCenters?: any[] } }
+  | { type: 'UPDATE_DATA_QUALITY'; payload: { score: number; issuesCount: number } }
   | { type: 'RESET_SIMULATION' };
 
@@ .. @@
   activeEvent: null,
   isRunning: false,
   speed: 1,
+  dataQuality: {
+    score: 100,
+    lastCheck: null,
+    issuesCount: 0,
+  },
 };
 
@@ .. @@
       return { ...state, activeEvent: action.payload };
     case 'RESET_SIMULATION':
       return initialState;
+    case 'UPDATE_DATA':
+      return {
+        ...state,
+        stores: action.payload.stores || state.stores,
+        distributionCenters: action.payload.distributionCenters || state.distributionCenters,
+      };
+    case 'UPDATE_DATA_QUALITY':
+      return {
+        ...state,
+        dataQuality: {
+          score: action.payload.score,
+          lastCheck: new Date(),
+          issuesCount: action.payload.issuesCount,
+        },
+      };
     default:
       return state;