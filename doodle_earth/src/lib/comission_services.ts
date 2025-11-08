import { supabase } from '@/lib/supabase/client'; // or server depending on usage
// Then all your CRUD functions
```

**Option 2: Service file organized by feature**
```
src/lib/
├── supabase/
│   ├── client.ts
│   └── server.ts
└── commission/
    └── service.ts          ← Commission-specific CRUD