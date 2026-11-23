"use client";

import { CheckIcon } from "lucide-react";
import * as React from "react";
import { Checkbox, CheckboxGroup, composeRenderProps, Radio, RadioGroup } from "react-aria-components";
import { cn } from "../lib/utils.js";
import { Button, type ButtonProps } from "./button.js";
import { fieldControl } from "./field.js";
import { FieldError } from "./field-layout.js";

/*
 * Adapted from shadcn/ui's Questionnaire. Copyright (c) 2023 shadcn. MIT licence.
 * Built on React Aria rather than @shadcn/react, which is pre-1.0.
 *
 * Figma contract: Questionnaire, QuestionnaireProgress, QuestionnaireItem { type: single | multiple | text; isRequired },
 *                 QuestionnaireTitle, QuestionnaireDescription, QuestionnaireChoices, QuestionnaireChoice,
 *                 QuestionnaireChoiceDescription, QuestionnaireInput, QuestionnaireError, QuestionnaireActions,
 *                 QuestionnairePrevious, QuestionnaireSkip, QuestionnaireNext, QuestionnaireSubmit
 *
 * Asks one question at a time, for example when an assistant needs details.
 * QuestionnaireItem elements must be direct children of Questionnaire. Focus
 * moves to each new question's title.
 */

export type QuestionnaireAnswer = string | string[];
export type QuestionnaireAnswers = Record<string, QuestionnaireAnswer>;

type Step = { id: string; isRequired: boolean };

type QuestionnaireContextValue = {
  steps: Step[];
  index: number;
  answers: QuestionnaireAnswers;
  errorId: string | null;
  shouldFocusRef: React.RefObject<boolean>;
  setAnswer: (id: string, answer: QuestionnaireAnswer) => void;
  goNext: () => void;
  goPrevious: () => void;
  skip: () => void;
  submit: () => void;
};

const QuestionnaireContext = React.createContext<QuestionnaireContextValue | null>(null);

function useQuestionnaire() {
  const context = React.useContext(QuestionnaireContext);
  if (!context) throw new Error("Questionnaire parts must be used within a Questionnaire.");
  return context;
}

type ItemContextValue = { id: string; type: QuestionnaireItemProps["type"]; titleId: string; errorMessageId: string };

const ItemContext = React.createContext<ItemContextValue | null>(null);

function useItem() {
  const context = React.useContext(ItemContext);
  if (!context) throw new Error("This part must be used within a QuestionnaireItem.");
  return context;
}

function isEmpty(answer: QuestionnaireAnswer | undefined) {
  return answer === undefined || answer.length === 0 || (typeof answer === "string" && answer.trim() === "");
}

export type QuestionnaireProps = Omit<React.ComponentProps<"div">, "onSubmit"> & {
  defaultAnswers?: QuestionnaireAnswers;
  /** Called with every answer when the last question is submitted. */
  onSubmit?: (answers: QuestionnaireAnswers) => void;
};

export function Questionnaire({ className, defaultAnswers = {}, onSubmit, children, ...props }: QuestionnaireProps) {
  const [index, setIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState(defaultAnswers);
  const [errorId, setErrorId] = React.useState<string | null>(null);
  const shouldFocusRef = React.useRef(false);

  const steps = React.Children.toArray(children).flatMap((child) =>
    React.isValidElement<QuestionnaireItemProps>(child) && child.type === QuestionnaireItem
      ? [{ id: child.props.id, isRequired: child.props.isRequired ?? false }]
      : [],
  );
  const current = steps[index];
  const isCurrentValid = !current?.isRequired || !isEmpty(answers[current.id]);

  const moveTo = (next: number) => {
    shouldFocusRef.current = true;
    setErrorId(null);
    setIndex(Math.max(0, Math.min(steps.length - 1, next)));
  };

  const value: QuestionnaireContextValue = {
    steps,
    index,
    answers,
    errorId,
    shouldFocusRef,
    setAnswer: (id, answer) => {
      setAnswers((previous) => ({ ...previous, [id]: answer }));
      setErrorId(null);
    },
    goNext: () => {
      if (isCurrentValid) moveTo(index + 1);
      else setErrorId(current?.id ?? null);
    },
    goPrevious: () => moveTo(index - 1),
    skip: () => {
      if (index < steps.length - 1) moveTo(index + 1);
      else onSubmit?.(answers);
    },
    submit: () => {
      if (isCurrentValid) onSubmit?.(answers);
      else setErrorId(current?.id ?? null);
    },
  };

  return (
    <QuestionnaireContext.Provider value={value}>
      <div data-slot="questionnaire" className={cn("flex w-full min-w-0 flex-col gap-4", className)} {...props}>
        {children}
      </div>
    </QuestionnaireContext.Provider>
  );
}

/** "Question 1 of 3". */
export function QuestionnaireProgress({ className, ...props }: React.ComponentProps<"p">) {
  const { index, steps } = useQuestionnaire();
  return (
    <p data-slot="questionnaire-progress" className={cn("text-xs font-medium text-text-secondary tabular-nums", className)} {...props}>
      Question {index + 1} of {steps.length}
    </p>
  );
}

export type QuestionnaireItemProps = Omit<React.ComponentProps<"div">, "id"> & {
  /** The key for this answer. */
  id: string;
  /** Single uses radios, multiple uses checkboxes, text uses an input. */
  type: "single" | "multiple" | "text";
  /** Must be answered, and can't be skipped. */
  isRequired?: boolean;
};

export function QuestionnaireItem({ id, type, isRequired, className, children, ...props }: QuestionnaireItemProps) {
  const { steps, index } = useQuestionnaire();
  const baseId = React.useId();
  const value = React.useMemo(() => ({ id, type, titleId: `${baseId}-title`, errorMessageId: `${baseId}-error` }), [id, type, baseId]);
  if (steps[index]?.id !== id) return null;
  return (
    <ItemContext.Provider value={value}>
      <div role="group" aria-labelledby={value.titleId} data-required={isRequired || undefined} data-slot="questionnaire-item" className={cn("flex min-w-0 flex-col gap-3", className)} {...props}>
        {children}
      </div>
    </ItemContext.Provider>
  );
}

export type QuestionnaireTitleProps = React.ComponentProps<"h3"> & {
  /** Heading level. Defaults to 3. */
  level?: 2 | 3 | 4 | 5;
};

export function QuestionnaireTitle({ className, level = 3, ...props }: QuestionnaireTitleProps) {
  const { shouldFocusRef, index } = useQuestionnaire();
  const { titleId } = useItem();
  const ref = React.useRef<HTMLHeadingElement>(null);
  const Heading = `h${level}` as "h3";

  React.useEffect(() => {
    if (shouldFocusRef.current) {
      ref.current?.focus();
      shouldFocusRef.current = false;
    }
  }, [index, shouldFocusRef]);

  return (
    <Heading
      ref={ref}
      id={titleId}
      tabIndex={-1}
      data-slot="questionnaire-title"
      className={cn("focus-ring rounded-sm text-md leading-snug font-medium text-pretty text-text-default", className)}
      {...props}
    />
  );
}

export function QuestionnaireDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="questionnaire-description" className={cn("text-sm text-pretty text-text-secondary", className)} {...props} />;
}

export function QuestionnaireChoices({ className, children }: { className?: string; children: React.ReactNode }) {
  const { answers, errorId, setAnswer } = useQuestionnaire();
  const { id, type, titleId, errorMessageId } = useItem();
  const isInvalid = errorId === id;
  const shared = {
    "aria-labelledby": titleId,
    "aria-describedby": isInvalid ? errorMessageId : undefined,
    isInvalid,
    "data-slot": "questionnaire-choices",
    className: cn("grid min-w-0 gap-2", className),
  };
  if (type === "multiple") {
    const value = answers[id];
    return (
      <CheckboxGroup {...shared} value={Array.isArray(value) ? value : []} onChange={(next) => setAnswer(id, next)}>
        {children}
      </CheckboxGroup>
    );
  }
  const value = answers[id];
  return (
    <RadioGroup {...shared} value={typeof value === "string" ? value : null} onChange={(next) => setAnswer(id, next)}>
      {children}
    </RadioGroup>
  );
}

export type QuestionnaireChoiceProps = {
  value: string;
  isDisabled?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function QuestionnaireChoice({ value, isDisabled, className, children }: QuestionnaireChoiceProps) {
  const { type } = useItem();
  const isRadio = type !== "multiple";
  const Primitive = (isRadio ? Radio : Checkbox) as React.ElementType;
  return (
    <Primitive
      value={value}
      isDisabled={isDisabled}
      data-slot="questionnaire-choice"
      className={cn(
        "group/choice hit-area flex min-h-11 cursor-pointer items-start gap-2.5 rounded-lg border border-border-input bg-surface-default px-3 py-2.5 text-start text-sm text-text-default transition-colors select-none",
        "hover:bg-action-ghost-bg-hover data-focus-visible:focus-ring-drawn data-invalid:border-border-input-invalid",
        "data-selected:border-action-primary-bg data-selected:bg-surface-subtle data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className,
      )}
    >
      {composeRenderProps(children as never, (content: React.ReactNode, { isSelected }: { isSelected: boolean }) => (
        <>
          <span
            aria-hidden
            className={cn(
              "mt-0.5 flex size-4 shrink-0 items-center justify-center border border-border-input bg-surface-default text-text-on-primary",
              isRadio ? "rounded-full" : "rounded-[4px]",
              "group-data-selected/choice:border-action-primary-bg group-data-selected/choice:bg-action-primary-bg",
            )}
          >
            {isSelected ? isRadio ? <span className="size-2 rounded-full bg-text-on-primary" /> : <CheckIcon className="size-3.5" strokeWidth={3} /> : null}
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-0.5 leading-snug">{content}</span>
        </>
      ))}
    </Primitive>
  );
}

export function QuestionnaireChoiceDescription({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="questionnaire-choice-description" className={cn("text-text-secondary", className)} {...props} />;
}

export function QuestionnaireInput({ className, ...props }: Omit<React.ComponentProps<"input">, "value" | "defaultValue">) {
  const { answers, errorId, setAnswer, steps, index, goNext, submit } = useQuestionnaire();
  const { id, titleId, errorMessageId } = useItem();
  const isInvalid = errorId === id;
  const value = answers[id];
  return (
    <input
      data-slot="questionnaire-input"
      aria-labelledby={titleId}
      aria-invalid={isInvalid || undefined}
      aria-describedby={isInvalid ? errorMessageId : undefined}
      data-invalid={isInvalid || undefined}
      value={typeof value === "string" ? value : ""}
      onChange={(event) => setAnswer(id, event.target.value)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          if (index === steps.length - 1) submit();
          else goNext();
        }
      }}
      className={cn(fieldControl, "focus-ring placeholder:text-text-placeholder", className)}
      {...props}
    />
  );
}

export type QuestionnaireErrorProps = Omit<React.ComponentProps<"div">, "id"> & {
  /** Defaults to "Answer this question to continue." */
  children?: React.ReactNode;
};

/** Shown when a required question is left empty. */
export function QuestionnaireError({ className, children = "Answer this question to continue.", ...props }: QuestionnaireErrorProps) {
  const { errorId } = useQuestionnaire();
  const { id, errorMessageId } = useItem();
  if (errorId !== id) return null;
  return (
    <FieldError id={errorMessageId} data-slot="questionnaire-error" className={className} {...props}>
      <span>{children}</span>
    </FieldError>
  );
}

export function QuestionnaireActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="questionnaire-actions" className={cn("flex w-full items-center gap-2", className)} {...props} />;
}

export function QuestionnairePrevious({ children = "Previous", variant = "secondary", onPress, ...props }: ButtonProps) {
  const { index, goPrevious } = useQuestionnaire();
  if (index === 0) return null;
  return (
    <Button data-slot="questionnaire-previous" variant={variant} onPress={(event) => { onPress?.(event); goPrevious(); }} {...props}>
      {children}
    </Button>
  );
}

export function QuestionnaireSkip({ children = "Skip", variant = "ghost", className, onPress, ...props }: ButtonProps) {
  const { steps, index, skip } = useQuestionnaire();
  if (steps[index]?.isRequired) return null;
  return (
    <Button data-slot="questionnaire-skip" variant={variant} className={cn("ms-auto", className)} onPress={(event) => { onPress?.(event); skip(); }} {...props}>
      {children}
    </Button>
  );
}

export function QuestionnaireNext({ children = "Next", className, onPress, ...props }: ButtonProps) {
  const { steps, index, goNext } = useQuestionnaire();
  if (index >= steps.length - 1) return null;
  return (
    <Button
      data-slot="questionnaire-next"
      className={cn("[[data-slot=questionnaire-skip]~&]:ms-0 ms-auto", className)}
      onPress={(event) => { onPress?.(event); goNext(); }}
      {...props}
    >
      {children}
    </Button>
  );
}

export function QuestionnaireSubmit({ children = "Submit", className, onPress, ...props }: ButtonProps) {
  const { steps, index, submit } = useQuestionnaire();
  if (index !== steps.length - 1) return null;
  return (
    <Button
      data-slot="questionnaire-submit"
      className={cn("[[data-slot=questionnaire-skip]~&]:ms-0 ms-auto", className)}
      onPress={(event) => { onPress?.(event); submit(); }}
      {...props}
    >
      {children}
    </Button>
  );
}
