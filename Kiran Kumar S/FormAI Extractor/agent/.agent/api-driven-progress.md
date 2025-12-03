# Progress Bar with API-Driven Updates

## Summary
The progress bar now continues showing animated progress throughout the entire API call duration, only completing when the API returns COMPLETED or FAILED status.

## How It Works

### Progress Flow Tied to API Status

The progress bar updates are now **directly tied to the API polling**:

1. **Upload Phase (0-100%)**
   - Real upload progress from XMLHttpRequest
   - Completes when file upload finishes

2. **QUEUED Phase (→40%)**
   - Progress increases by 3% every 2 seconds (polling interval)
   - Continues until API status changes from QUEUED
   - Animated shimmer and glow effects active
   - Maximum: 40%

3. **PROCESSING Phase (40%→90%)**
   - Progress starts at 40% (or jumps to 40% if lower)
   - Increases by 5% every 2 seconds (polling interval)
   - Continues until API returns COMPLETED/FAILED
   - Animated shimmer and glow effects active
   - Maximum: 90%

4. **COMPLETED/FAILED (100%)**
   - Progress jumps to 100%
   - Animations stop
   - Processing state ends

## Key Features

### ✅ API-Synchronized Progress
- Progress bar stays active **until the API call completes**
- Updates every 2 seconds when polling the API
- No premature completion

### ✅ Visual Feedback
- **Shimmer effect** continuously moves across the bar
- **Pulsing glow** indicates active processing
- Progress percentage updates in real-time

### ✅ Smooth Transitions
- 0.8s ease-in-out transitions for width changes
- Gradual progress increases (not jumpy)
- Professional, polished appearance

## Code Logic

```typescript
const poll = async () => {
  // Fetch API status
  const data = await fetch(API_BASE + "/runs/" + id);
  const newStatus = data.status;
  
  // Update progress based on actual API status
  if (newStatus === "QUEUED") {
    setUploadProgress((prev) => Math.min(40, prev + 3));
  } else if (newStatus === "PROCESSING") {
    setUploadProgress((prev) => {
      if (prev < 40) return 40;
      return Math.min(90, prev + 5);
    });
  }
  
  // Only complete when API confirms
  if (newStatus === "COMPLETED" || newStatus === "FAILED") {
    setUploadProgress(100);
    setIsProcessing(false);
    return; // Stop polling
  }
  
  // Continue polling every 2 seconds
  setTimeout(poll, 2000);
};
```

## User Experience

### What the User Sees:

1. **Upload starts** → Progress bar appears, fills to 100% during upload
2. **API processing begins** → Progress continues with animations
3. **QUEUED status** → Progress gradually increases to 40%
   - Shimmer sweeps across bar
   - Glow pulses around bar
   - Percentage updates: 100% → 103% → 106% → ... → 40%
4. **PROCESSING status** → Progress gradually increases to 90%
   - Shimmer continues
   - Glow continues
   - Percentage updates: 40% → 45% → 50% → ... → 90%
5. **COMPLETED status** → Progress jumps to 100%
   - Animations stop
   - Processing complete

### Benefits:

- ✅ **Accurate**: Progress reflects actual API status
- ✅ **Continuous**: No gaps or pauses in visual feedback
- ✅ **Informative**: User knows processing is happening
- ✅ **Professional**: Smooth, polished animations
- ✅ **Reliable**: Only completes when API confirms

## Technical Details

- **Polling Interval**: 2 seconds
- **Progress Increment (QUEUED)**: +3% per poll (max 40%)
- **Progress Increment (PROCESSING)**: +5% per poll (max 90%)
- **Animation Duration**: 0.8s (width transition)
- **Shimmer Cycle**: 1.5s
- **Glow Cycle**: 2s
- **Completion**: Only when API returns COMPLETED/FAILED

## Error Handling

If an error occurs during polling:
- Progress bar stops
- Processing state ends
- Error message displayed to user
- Animations stop

This ensures the progress bar doesn't continue indefinitely if something goes wrong.
