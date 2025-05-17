```markdown
# Supabase Configuration Backup

## Database Schema

### Tables

1. **users**
   - Primary key: `id` (uuid)
   - Unique constraints: `username`, `email`
   - Username validation: Must start with @ and be 3-30 characters
   - Timestamps: `created_at`, `updated_at`

2. **creations**
   - Primary key: `id` (uuid)
   - Foreign key: `user_id` references users(id)
   - Required fields: `title`, `category`
   - Media storage: `media_urls` as text array

3. **reactions**
   - Primary key: `id` (uuid)
   - Foreign keys: `user_id`, `creation_id`
   - Unique constraint: One reaction type per user per creation

4. **comments**
   - Primary key: `id` (uuid)
   - Foreign keys: `user_id`, `creation_id`
   - Required field: `content`
   - Timestamps: `created_at`, `updated_at`

5. **collaborations**
   - Primary key: `id` (uuid)
   - Foreign keys: `creation_id`, `user_id`
   - Unique constraint: One role per user per creation

6. **follows**
   - Primary key: `id` (uuid)
   - Foreign keys: `follower_id`, `following_id`
   - Unique constraint: One follow relationship per pair

### Storage Buckets

1. **avatars**
   - Public access
   - User-specific folders
   - Image uploads only

2. **creations_media**
   - Public access
   - Creation-specific folders
   - Multiple media types

3. **posts**
   - Public access
   - User-specific folders
   - Multiple media types

## Security Policies

### Row Level Security (RLS)

All tables have RLS enabled with specific policies:

1. **Users**
   - Public read access
   - Self-update only
   - Self-delete only

2. **Creations**
   - Public read access
   - Author and collaborators can update
   - Only author can delete

3. **Reactions & Comments**
   - Public read access
   - Authenticated users can create
   - Self-delete only

4. **Collaborations**
   - Public read access
   - Only creation authors can manage

5. **Follows**
   - Public read access
   - Self-management of follow relationships

### Storage Policies

1. **Avatars**
   - Public read access
   - Authenticated upload
   - Self-management of own files

2. **Creations Media**
   - Public read access
   - Authenticated upload
   - Author management only

3. **Posts**
   - Public read access
   - Authenticated upload
   - Self-management of own files

## Performance Optimizations

### Indexes

1. Username search: `users_username_idx`
2. User content: `creations_user_id_idx`
3. Category filtering: `creations_category_idx`
4. Interaction queries:
   - `reactions_creation_id_idx`
   - `comments_creation_id_idx`
   - `follows_follower_id_idx`
   - `follows_following_id_idx`

### Triggers

Automatic `updated_at` maintenance for:
- users
- creations
- comments

## Common Issues & Solutions

1. **Username Validation**
   - Issue: Username format validation
   - Solution: CHECK constraint with regex pattern

2. **Cascade Deletes**
   - Issue: Orphaned records
   - Solution: ON DELETE CASCADE for all foreign keys

3. **Concurrent Updates**
   - Issue: Race conditions
   - Solution: Row-level locks and timestamps

4. **Storage Management**
   - Issue: File organization
   - Solution: Structured folder patterns by user/creation

## Maintenance Tips

1. Regular backup of:
   - Database schema
   - Storage buckets
   - RLS policies

2. Monitor:
   - Index usage
   - Storage usage
   - Auth rate limits

3. Periodic cleanup of:
   - Unused media files
   - Inactive accounts
   - Failed uploads

## Security Best Practices

1. Always validate input on both client and server
2. Use prepared statements for all SQL
3. Implement rate limiting for API calls
4. Regular security audits of RLS policies
5. Monitor auth logs for suspicious activity

## Suggested Improvements

1. Add full-text search capabilities
2. Implement content moderation system
3. Add caching layer for frequent queries
4. Create backup retention policy
5. Add analytics tracking
```