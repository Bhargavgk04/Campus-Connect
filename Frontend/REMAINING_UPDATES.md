# Remaining Files to Update

The following files still have hardcoded `http://localhost:8080` URLs that need to be updated to use the API configuration.

## Pattern to Follow

For each file:

1. **Add import at the top:**
   ```javascript
   import { getApiUrl, API_URL, SOCKET_IO_URL } from "@/config/api";
   ```

2. **Replace API calls:**
   - `'http://localhost:8080/api/...'` → `getApiUrl('...')`
   - `"http://localhost:8080/api/..."` → `getApiUrl("...")`
   - `\`http://localhost:8080/api/...\`` → ``getApiUrl(`...`)``

3. **Replace Socket.IO:**
   - `io('http://localhost:8080')` → `io(SOCKET_IO_URL)`

4. **Replace image URLs:**
   - `` `http://localhost:8080${path}` `` → `` `${API_URL}${path}` ``

## Files Still Needing Updates

### Pages
- [ ] `src/pages/Questions.jsx`
- [ ] `src/pages/QuestionDetail.jsx`
- [ ] `src/pages/CollegesList.jsx`
- [ ] `src/pages/MyHubs.jsx`
- [ ] `src/pages/Activity.jsx`
- [ ] `src/pages/Login.jsx`
- [ ] `src/pages/admin/Dashboard.jsx`
- [ ] `src/pages/admin/Users.jsx`
- [ ] `src/pages/admin/Reports.jsx`
- [ ] `src/pages/admin/Colleges.jsx`
- [ ] `src/pages/admin/AddAdmin.jsx`

### Components
- [ ] `src/components/QuestionForm.jsx`
- [ ] `src/components/NewQuestion.jsx`
- [ ] `src/components/AnswerCard.jsx`
- [ ] `src/components/AnswerForm.jsx`
- [ ] `src/components/MyHub.jsx`
- [ ] `src/components/EditProfileModal.jsx`
- [ ] `src/components/EditSkillsModal.jsx`
- [ ] `src/components/EditAchievementsModal.jsx`
- [ ] `src/components/ViewProfileDialog.jsx`
- [ ] `src/components/Auth/Login.jsx`
- [ ] `src/components/Auth/Register.js`
- [ ] `src/components/Auth/ForgotPassword.jsx`
- [ ] `src/components/Auth/ResetPassword.jsx`
- [ ] `src/components/admin/UserManagement.jsx`
- [ ] `src/components/admin/RestrictedWords.jsx`
- [ ] `src/components/admin/AddCollegeDialog.jsx`
- [ ] `src/components/admin/EditCollegeDialog.jsx`
- [ ] `src/components/Questions/QuestionForm.jsx`

## Quick Update Script (Manual)

You can use find/replace in your editor:

**Find:** `http://localhost:8080/api/`
**Replace with:** `getApiUrl('` (then manually add closing `)` and adjust quotes)

Or use this pattern:
1. Find: `'http://localhost:8080/api/`
2. Replace: `getApiUrl('`
3. Then manually close the quotes and add closing parenthesis

## Example Transformations

**Before:**
```javascript
axios.get('http://localhost:8080/api/colleges')
```

**After:**
```javascript
import { getApiUrl } from "@/config/api";
axios.get(getApiUrl('colleges'))
```

**Before:**
```javascript
const socket = io('http://localhost:8080');
```

**After:**
```javascript
import { SOCKET_IO_URL } from "@/config/api";
const socket = io(SOCKET_IO_URL);
```

**Before:**
```javascript
setImageUrl(`http://localhost:8080${college.image}`);
```

**After:**
```javascript
import { API_URL } from "@/config/api";
setImageUrl(`${API_URL}${college.image}`);
```

## Files Already Updated ✅

- ✅ `src/contexts/AuthContext.jsx`
- ✅ `src/components/QuestionsList.jsx`
- ✅ `src/components/QuestionDetail.jsx`
- ✅ `src/components/QuestionCard.jsx`
- ✅ `src/pages/CollegePage.jsx`
- ✅ `src/pages/Profile.jsx`
- ✅ `src/pages/Index.jsx`
- ✅ `src/pages/MyHub.jsx`
- ✅ `src/components/CollegeCard.jsx`

## Notes

- All files must import from `@/config/api`
- The `getApiUrl` function automatically adds the `/api/` prefix
- For Socket.IO, use `SOCKET_IO_URL` constant
- For image URLs, use `API_URL` constant

