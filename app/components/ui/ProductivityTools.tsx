"use client";

import { Calendar, Clock, Target, BarChart3, Timer, Plus, CheckCircle2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useUser } from "../../contexts/UserContext";
import { useToast } from "../../contexts/ToastContext";

export default function ProductivityTools() {
  const { currentUser } = useUser();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'calendar' | 'focus' | 'stats'>('calendar');
  const [focusMode, setFocusMode] = useState(false);
  const [focusTimer, setFocusTimer] = useState(25 * 60); // 25 minutes in seconds
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [learningGoals, setLearningGoals] = useState<any[]>([]);
  const [focusSessions, setFocusSessions] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventType, setNewEventType] = useState('course');
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDeadline, setNewGoalDeadline] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !currentUser) return;

    // Fetch calendar events
    const fetchCalendarEvents = async () => {
      const { data } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('event_date', { ascending: true })
        .limit(5);
      if (data) setCalendarEvents(data);
    };

    // Fetch learning goals
    const fetchLearningGoals = async () => {
      const { data } = await supabase
        .from('learning_goals')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false })
        .limit(3);
      if (data) setLearningGoals(data);
    };

    // Fetch focus sessions
    const fetchFocusSessions = async () => {
      const { data } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('session_date', { ascending: false })
        .limit(10);
      if (data) setFocusSessions(data);
    };

    fetchCalendarEvents();
    fetchLearningGoals();
    fetchFocusSessions();

    // Set up real-time subscriptions
    const eventsSubscription = supabase
      .channel('calendar_events_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'calendar_events', filter: `user_id=eq.${currentUser.id}` }, () => fetchCalendarEvents())
      .subscribe();

    const goalsSubscription = supabase
      .channel('learning_goals_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'learning_goals', filter: `user_id=eq.${currentUser.id}` }, () => fetchLearningGoals())
      .subscribe();

    const focusSubscription = supabase
      .channel('focus_sessions_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'focus_sessions', filter: `user_id=eq.${currentUser.id}` }, () => fetchFocusSessions())
      .subscribe();

    return () => {
      eventsSubscription.unsubscribe();
      goalsSubscription.unsubscribe();
      focusSubscription.unsubscribe();
    };
  }, [mounted, currentUser]);

  // Focus timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (focusMode && focusTimer > 0) {
      interval = setInterval(() => {
        setFocusTimer(prev => prev - 1);
      }, 1000);
    } else if (focusTimer === 0 && focusMode) {
      // Timer finished
      handleFocusSessionComplete();
    }
    return () => clearInterval(interval);
  }, [focusMode, focusTimer]);

  const handleFocusSessionComplete = async () => {
    if (!currentUser) return;
    
    const { error } = await supabase
      .from('focus_sessions')
      .insert({
        user_id: currentUser.id,
        duration_minutes: 25,
        completed: true,
      });

    setFocusMode(false);
    setFocusTimer(25 * 60);
  };

  const handleAddEvent = async () => {
    if (!currentUser) {
      showToast('Please sign in to add events', 'error');
      return;
    }
    if (!newEventTitle || !newEventDate) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {

      // First check if table exists by trying to fetch
      const { error: fetchError } = await supabase
        .from('calendar_events')
        .select('id')
        .limit(1);

      if (fetchError) {
        showToast('Calendar events table not found. Please run the database migration.', 'error');
        return;
      }

      // Now try to insert
      const { data, error } = await supabase
        .from('calendar_events')
        .insert({
          user_id: currentUser.id,
          title: newEventTitle,
          event_date: new Date(newEventDate).toISOString(),
          event_type: newEventType,
        })
        .select();


      if (error) {
        showToast(`Failed to add event: ${error.message || 'Unknown error'}`, 'error');
      } else {
        setNewEventTitle('');
        setNewEventDate('');
        setNewEventType('course');
        setShowAddEvent(false);
        showToast('Event added successfully!', 'success');
      }
    } catch (err) {
      showToast('An unexpected error occurred. Please try again.', 'error');
    }
  };

  const handleAddGoal = async () => {
    if (!currentUser) {
      showToast('Please sign in to add goals', 'error');
      return;
    }
    if (!newGoalTitle) {
      showToast('Please enter a goal title', 'error');
      return;
    }

    try {
      const { error } = await supabase
        .from('learning_goals')
        .insert({
          user_id: currentUser.id,
          goal_title: newGoalTitle,
          deadline: newGoalDeadline ? new Date(newGoalDeadline).toISOString() : null,
          progress: 0,
        });

      if (error) {
        showToast('Failed to add goal. Please try again.', 'error');
      } else {
        setNewGoalTitle('');
        setNewGoalDeadline('');
        setShowAddGoal(false);
        showToast('Goal added successfully!', 'success');
      }
    } catch (err) {
      showToast('An unexpected error occurred. Please try again.', 'error');
    }
  };

  const handleUpdateGoalProgress = async (goalId: string, newProgress: number) => {
    await supabase
      .from('learning_goals')
      .update({ progress: newProgress })
      .eq('id', goalId);
  };

  // Calculate statistics from real data
  const totalFocusTime = focusSessions.reduce((acc, session) => acc + (session.duration_minutes || 0), 0);
  const completedGoals = learningGoals.filter(goal => goal.progress === 100).length;
  const totalGoals = learningGoals.length;
  const goalsMetPercentage = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return (
    <div className="bg-[#181818] p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-[#60a5fa]" />
          Productivity Tools
        </h3>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
            activeTab === 'calendar'
              ? 'bg-[#60a5fa] text-black'
              : 'bg-[#282828] text-white hover:bg-[#333]'
          }`}
        >
          Calendar
        </button>
        <button
          onClick={() => setActiveTab('focus')}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
            activeTab === 'focus'
              ? 'bg-[#60a5fa] text-black'
              : 'bg-[#282828] text-white hover:bg-[#333]'
          }`}
        >
          Focus Mode
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
            activeTab === 'stats'
              ? 'bg-[#60a5fa] text-black'
              : 'bg-[#282828] text-white hover:bg-[#333]'
          }`}
        >
          Statistics
        </button>
      </div>

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <div className="space-y-4">
          <div className="bg-[#282828] p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-white">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="p-1 hover:bg-[#333] rounded transition-colors"
                >
                  <Calendar className="w-4 h-4 text-[#b3b3b3]" />
                </button>
                <button
                  onClick={() => setCurrentMonth(new Date())}
                  className="p-1 hover:bg-[#333] rounded transition-colors"
                >
                  <div className="w-4 h-4 rounded-full bg-[#60a5fa]" />
                </button>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="p-1 hover:bg-[#333] rounded transition-colors"
                >
                  <Calendar className="w-4 h-4 text-[#b3b3b3]" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-xs mb-2">
              <span className="text-[#b3b3b3]">Sun</span>
              <span className="text-[#b3b3b3]">Mon</span>
              <span className="text-[#b3b3b3]">Tue</span>
              <span className="text-[#b3b3b3]">Wed</span>
              <span className="text-[#b3b3b3]">Thu</span>
              <span className="text-[#b3b3b3]">Fri</span>
              <span className="text-[#b3b3b3]">Sat</span>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {(() => {
                const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
                const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
                const startDay = firstDay.getDay();
                const totalDays = lastDay.getDate();
                const days = [];

                // Empty cells for days before the first day of the month
                for (let i = 0; i < startDay; i++) {
                  days.push(<div key={`empty-${i}`} className="p-2 text-[#3f3f3f]" />);
                }

                // Days of the month
                for (let day = 1; day <= totalDays; day++) {
                  const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                  const dateStr = date.toISOString().split('T')[0];
                  const hasEvent = calendarEvents.some(event => {
                    const eventDate = new Date(event.event_date);
                    // Compare year, month, and day to avoid timezone issues
                    return eventDate.getFullYear() === date.getFullYear() &&
                           eventDate.getMonth() === date.getMonth() &&
                           eventDate.getDate() === day;
                  });

                  days.push(
                    <div
                      key={day}
                      onClick={() => {
                        setSelectedDate(date);
                        const eventsOnDay = calendarEvents.filter(event => {
                          const eventDate = new Date(event.event_date);
                          return eventDate.getFullYear() === date.getFullYear() &&
                                 eventDate.getMonth() === date.getMonth() &&
                                 eventDate.getDate() === day;
                        });
                        if (eventsOnDay.length > 0) {
                          setSelectedEvent(eventsOnDay[0]);
                          setShowEventDetails(true);
                        } else {
                          setShowAddEvent(true);
                          setNewEventDate(date.toISOString().split('T')[0]);
                        }
                      }}
                      className={`p-2 rounded-lg cursor-pointer transition-colors ${
                        hasEvent
                          ? 'bg-[#60a5fa]/20 text-[#60a5fa] hover:bg-[#60a5fa]/30'
                          : 'text-white hover:bg-[#333]'
                      }`}
                    >
                      {day}
                    </div>
                  );
                }

                return days;
              })()}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white mb-3">Upcoming Events</h4>
            {!mounted ? (
              <div className="animate-pulse space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-[#282828] rounded-lg" />
                ))}
              </div>
            ) : calendarEvents.length > 0 ? (
              calendarEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-3 bg-[#282828] rounded-lg flex items-center gap-3 hover:bg-[#333] transition-colors cursor-pointer"
                >
                  <div className={`w-2 h-2 rounded-full ${
                    event.event_type === 'course' ? 'bg-[#60a5fa]' : event.event_type === 'qa' ? 'bg-blue-500' : 'bg-red-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{event.title}</p>
                    <p className="text-xs text-[#b3b3b3]">{new Date(event.event_date).toLocaleDateString()} at {new Date(event.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#b3b3b3] text-center py-4">No upcoming events</p>
            )}
          </div>

          {/* Add Event Modal */}
          {showAddEvent && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-[#282828] p-6 rounded-lg w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-white">Add Event</h4>
                  <button onClick={() => setShowAddEvent(false)} className="text-[#b3b3b3] hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#b3b3b3] mb-1 block">Event Title</label>
                    <input
                      type="text"
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      className="w-full bg-[#181818] text-white px-3 py-2 rounded-lg border border-[#3a3a3a] focus:border-[#60a5fa] outline-none"
                      placeholder="Enter event title"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#b3b3b3] mb-1 block">Date & Time</label>
                    <input
                      type="datetime-local"
                      value={newEventDate}
                      onChange={(e) => setNewEventDate(e.target.value)}
                      className="w-full bg-[#181818] text-white px-3 py-2 rounded-lg border border-[#3a3a3a] focus:border-[#60a5fa] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#b3b3b3] mb-1 block">Event Type</label>
                    <select
                      value={newEventType}
                      onChange={(e) => setNewEventType(e.target.value)}
                      className="w-full bg-[#181818] text-white px-3 py-2 rounded-lg border border-[#3a3a3a] focus:border-[#60a5fa] outline-none"
                    >
                      <option value="course">Course</option>
                      <option value="qa">Q&A Session</option>
                      <option value="deadline">Deadline</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <button
                    onClick={handleAddEvent}
                    className="w-full py-3 bg-[#60a5fa] text-black font-bold rounded-lg hover:scale-105 transition-transform"
                  >
                    Add Event
                  </button>
                </div>
              </div>
            </div>
          )}

          <button onClick={() => setShowAddEvent(true)} className="w-full py-3 border-2 border-dashed border-[#282828] rounded-lg text-[#b3b3b3] text-sm font-bold hover:border-[#60a5fa] hover:text-[#60a5fa] transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Add Event
          </button>

          {/* Event Details Modal */}
          {showEventDetails && selectedEvent && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-[#282828] p-6 rounded-lg w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-white">Event Details</h4>
                  <button onClick={() => setShowEventDetails(false)} className="text-[#b3b3b3] hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-[#b3b3b3] mb-1">Title</p>
                    <p className="text-sm font-bold text-white">{selectedEvent.title}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#b3b3b3] mb-1">Date & Time</p>
                    <p className="text-sm text-white">{new Date(selectedEvent.event_date).toLocaleDateString()} at {new Date(selectedEvent.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#b3b3b3] mb-1">Type</p>
                    <p className="text-sm text-white capitalize">{selectedEvent.event_type}</p>
                  </div>
                  {selectedEvent.description && (
                    <div>
                      <p className="text-xs text-[#b3b3b3] mb-1">Description</p>
                      <p className="text-sm text-white">{selectedEvent.description}</p>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setShowEventDetails(false);
                      // Add delete functionality here if needed
                    }}
                    className="w-full py-3 bg-red-500/20 text-red-500 font-bold rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    Delete Event
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Focus Mode Tab */}
      {activeTab === 'focus' && (
        <div className="space-y-4">
          {!focusMode ? (
            <div className="text-center py-8">
              <Timer className="w-16 h-16 text-[#60a5fa] mx-auto mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">Focus Mode</h4>
              <p className="text-sm text-[#b3b3b3] mb-6">Use Pomodoro technique to boost productivity</p>
              <button
                onClick={() => setFocusMode(true)}
                className="px-6 py-3 bg-[#60a5fa] text-black font-bold rounded-full hover:scale-105 transition-transform"
              >
                Start Focus Session
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-32 h-32 rounded-full bg-[#282828] mx-auto mb-6 flex items-center justify-center border-4 border-[#60a5fa]">
                <span className="text-3xl font-bold text-white">
                  {Math.floor(focusTimer / 60)}:{(focusTimer % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Focus Session</h4>
              <p className="text-sm text-[#b3b3b3] mb-6">Stay focused and avoid distractions</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setFocusMode(false)}
                  className="px-4 py-2 bg-[#282828] text-white font-bold rounded-full hover:bg-[#333] transition-colors"
                >
                  End Session
                </button>
                <button className="px-4 py-2 bg-[#60a5fa] text-black font-bold rounded-full hover:scale-105 transition-transform">
                  Take Break
                </button>
              </div>
            </div>
          )}

          {/* Focus Stats */}
          <div className="bg-[#282828] p-4 rounded-lg">
            <h4 className="text-sm font-bold text-white mb-3">Today&apos;s Focus</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-[#60a5fa]">{focusSessions.length}</p>
                <p className="text-xs text-[#b3b3b3]">Sessions</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalFocusTime}m</p>
                <p className="text-xs text-[#b3b3b3]">Total Time</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{focusSessions.length > 0 ? '100%' : '0%'}</p>
                <p className="text-xs text-[#b3b3b3]">Focus Rate</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#282828] p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-[#60a5fa]" />
                <span className="text-xs text-[#b3b3b3]">Total Time</span>
              </div>
              <p className="text-xl font-bold text-white">{totalFocusTime}m</p>
              <p className="text-xs text-[#60a5fa]">{focusSessions.length} sessions</p>
            </div>
            <div className="bg-[#282828] p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-[#60a5fa]" />
                <span className="text-xs text-[#b3b3b3]">Completed</span>
              </div>
              <p className="text-xl font-bold text-white">{completedGoals} Tasks</p>
              <p className="text-xs text-[#60a5fa]">{totalGoals} total goals</p>
            </div>
            <div className="bg-[#282828] p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-[#60a5fa]" />
                <span className="text-xs text-[#b3b3b3]">Goals Met</span>
              </div>
              <p className="text-xl font-bold text-white">{completedGoals}/{totalGoals}</p>
              <p className="text-xs text-[#b3b3b3]">{goalsMetPercentage}% completion</p>
            </div>
            <div className="bg-[#282828] p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-[#60a5fa]" />
                <span className="text-xs text-[#b3b3b3]">Events</span>
              </div>
              <p className="text-xl font-bold text-white">{calendarEvents.length}</p>
              <p className="text-xs text-[#60a5fa]">Upcoming</p>
            </div>
          </div>

          {/* Learning Goals */}
          <div className="bg-[#282828] p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-white">Learning Goals</h4>
              <button onClick={() => setShowAddGoal(true)} className="text-xs text-[#60a5fa] hover:underline">+ Add Goal</button>
            </div>
            <div className="space-y-2">
              {!mounted ? (
                <div className="animate-pulse space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-[#181818] rounded-lg" />
                  ))}
                </div>
              ) : learningGoals.length > 0 ? (
                learningGoals.map((goal) => (
                  <div key={goal.id} className="p-3 bg-[#181818] rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold text-white">{goal.goal_title}</p>
                      <span className="text-xs text-[#b3b3b3]">{goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'No deadline'}</span>
                    </div>
                    <div className="w-full bg-[#282828] rounded-full h-1.5 mb-2">
                      <div
                        className="h-full bg-gradient-to-r from-[#60a5fa] to-[#60a5fa]/80 rounded-full"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                    <div className="flex gap-2">
                      {[25, 50, 75, 100].map((progress) => (
                        <button
                          key={progress}
                          onClick={() => handleUpdateGoalProgress(goal.id, progress)}
                          className={`flex-1 py-1 text-xs rounded ${
                            goal.progress >= progress
                              ? 'bg-[#60a5fa] text-black'
                              : 'bg-[#282828] text-[#b3b3b3] hover:bg-[#333]'
                          }`}
                        >
                          {progress}%
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#b3b3b3] text-center py-4">No learning goals set</p>
              )}
            </div>
          </div>

          {/* Add Goal Modal */}
          {showAddGoal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-[#282828] p-6 rounded-lg w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-white">Add Learning Goal</h4>
                  <button onClick={() => setShowAddGoal(false)} className="text-[#b3b3b3] hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#b3b3b3] mb-1 block">Goal Title</label>
                    <input
                      type="text"
                      value={newGoalTitle}
                      onChange={(e) => setNewGoalTitle(e.target.value)}
                      className="w-full bg-[#181818] text-white px-3 py-2 rounded-lg border border-[#3a3a3a] focus:border-[#60a5fa] outline-none"
                      placeholder="Enter your learning goal"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#b3b3b3] mb-1 block">Deadline (Optional)</label>
                    <input
                      type="date"
                      value={newGoalDeadline}
                      onChange={(e) => setNewGoalDeadline(e.target.value)}
                      className="w-full bg-[#181818] text-white px-3 py-2 rounded-lg border border-[#3a3a3a] focus:border-[#60a5fa] outline-none"
                    />
                  </div>
                  <button
                    onClick={handleAddGoal}
                    className="w-full py-3 bg-[#60a5fa] text-black font-bold rounded-lg hover:scale-105 transition-transform"
                  >
                    Add Goal
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
