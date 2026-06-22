import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useInterviewStore } from '../store/interviewStore.js';
import Card from '../shared/components/Card.jsx';
import Button from '../shared/components/Button.jsx';
import Input from '../shared/components/Input.jsx';
import { BookOpen, Briefcase, Award, Settings, Clock, ArrowLeft, Cpu } from 'lucide-react';
import { ROUTES } from '../shared/constants/routes.js';

const TOPIC_SUGGESTIONS = [
  'React Hooks',
  'JWT Authentication',
  'SQL Joins',
  'Binary Search',
  'System Design',
  'REST APIs',
  'Microservices',
];

const ROLE_SUGGESTIONS = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Software Engineer',
];

const CreateInterviewPage = () => {
  const { createInterview, loading } = useInterviewStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      topic: '',
      role: '',
      difficulty: 'Intermediate',
      interviewType: 'Technical',
      duration: 10,
    },
  });

  const onSubmit = async (data) => {
    // Parse duration to number
    data.duration = Number(data.duration);
    
    const interview = await createInterview(data);
    if (interview && interview._id) {
      navigate(`/interviews/${interview._id}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back to Dashboard */}
      <button
        onClick={() => navigate(ROUTES.DASHBOARD)}
        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors focus:outline-none"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </button>

      {/* Main setup card */}
      <Card
        title="Setup Your Mock Interview"
        subtitle="Configure the AI interviewer's persona and focus topics"
        className="shadow-sm border-slate-200"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Topic */}
          <div className="space-y-2">
            <Input
              label="Interview Topic"
              id="topic"
              placeholder="e.g. React Hooks, Selection Sort, SQL Joins"
              required
              icon={BookOpen}
              error={errors.topic?.message}
              {...register('topic', {
                required: 'Topic is required',
                maxLength: {
                  value: 50,
                  message: 'Topic must be under 50 characters',
                },
              })}
            />
            {/* Suggestions */}
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider self-center mr-1">
                Suggestions:
              </span>
              {TOPIC_SUGGESTIONS.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => setValue('topic', sug, { shouldValidate: true })}
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-800 hover:border-slate-350 transition-all focus:outline-none"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Input
              label="Target Job Role"
              id="role"
              placeholder="e.g. Frontend Developer, Software Engineer"
              required
              icon={Briefcase}
              error={errors.role?.message}
              {...register('role', {
                required: 'Target job role is required',
                maxLength: {
                  value: 50,
                  message: 'Role must be under 50 characters',
                },
              })}
            />
            {/* Suggestions */}
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider self-center mr-1">
                Suggestions:
              </span>
              {ROLE_SUGGESTIONS.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => setValue('role', sug, { shouldValidate: true })}
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-800 hover:border-slate-350 transition-all focus:outline-none"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Two-Column Grid for Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            {/* Difficulty */}
            <div>
              <label
                htmlFor="difficulty"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-550 mb-1.5"
              >
                Difficulty
              </label>
              <div className="relative">
                <select
                  id="difficulty"
                  className="w-full rounded-lg bg-white border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-700 px-4 py-2.5 text-sm transition-all outline-none"
                  {...register('difficulty')}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            {/* Interview Type */}
            <div>
              <label
                htmlFor="interviewType"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-550 mb-1.5"
              >
                Interview Type
              </label>
              <div className="relative">
                <select
                  id="interviewType"
                  className="w-full rounded-lg bg-white border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-700 px-4 py-2.5 text-sm transition-all outline-none"
                  {...register('interviewType')}
                >
                  <option value="Technical">Technical</option>
                  <option value="Behavioral">Behavioral</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label
                htmlFor="duration"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-550 mb-1.5"
              >
                Duration
              </label>
              <div className="relative">
                <select
                  id="duration"
                  className="w-full rounded-lg bg-white border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-700 px-4 py-2.5 text-sm transition-all outline-none"
                  {...register('duration')}
                >
                  <option value={10}>10 Minutes</option>
                  <option value={20}>20 Minutes</option>
                  <option value={30}>30 Minutes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="rounded-lg bg-indigo-50/50 border border-indigo-100 p-4 mt-3">
            <h4 className="text-xs font-bold text-indigo-650 mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
              <Cpu className="h-4 w-4" /> AI Interviewer Behavior
            </h4>
            <ul className="list-disc pl-4 text-[11px] text-slate-550 space-y-1">
              <li>Realistic, adaptive questions suited to your selected difficulty.</li>
              <li>Asks only one question at a time and listens to your responses.</li>
              <li>May challenge incorrect assumptions or drill down into details.</li>
              <li>Includes Text-to-Speech voices and microphone transcribing controls.</li>
            </ul>
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={loading}
            icon={Cpu}
          >
            Start Mock Interview
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default CreateInterviewPage;
