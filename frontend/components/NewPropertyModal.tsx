"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";

import { usePortfolioStore } from "../store/usePortfolio";
import type { Property } from "../store/usePortfolio";

type PropertyDraft = Omit<Property, "id">;

const defaultForm: PropertyDraft = {
  name: "",
  purchasePrice: 250000,
  downPayment: 50000,
  mortgageRate: 0.045,
  mortgageYears: 30,
  annualRent: 24000,
  annualExpenses: 6000,
};

export default function NewPropertyModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<PropertyDraft>(defaultForm);
  const { addProperty } = usePortfolioStore();

  const close = () => {
    setIsOpen(false);
    setForm(defaultForm);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addProperty(form);
    close();
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setIsOpen(true)}
        whileHover={{ y: -2, boxShadow: "0 24px 70px -45px rgba(51,204,255,0.9)" }}
        whileTap={{ scale: 0.96 }}
        className="inline-flex items-center gap-2 rounded-full border border-[#33ccff]/60 bg-[#33ccff1a] px-5 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#c7f2ff] shadow-[0_18px_60px_-46px_rgba(51,204,255,0.85)] backdrop-blur"
      >
        Add Property
      </motion.button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-6">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-left align-middle shadow-[0_40px_120px_-60px_rgba(34,211,238,0.45)] transition-all backdrop-blur-xl">
                  <Dialog.Title className="text-xl font-semibold tracking-[0.08em] text-white">
                    Add a Property
                  </Dialog.Title>
                  <p className="mt-1 text-sm text-slate-300">
                    Capture acquisition assumptions to project forward-looking returns.
                  </p>
                  <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="text-xs uppercase tracking-[0.16em] text-slate-400">
                        Name
                        <input
                          required
                          value={form.name}
                          onChange={(event) =>
                            setForm((prev) => ({ ...prev, name: event.target.value }))
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 shadow-[inset_0_1px_0_rgba(94,234,212,0.15)] focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                        />
                      </label>
                      <label className="text-xs uppercase tracking-[0.16em] text-slate-400">
                        Purchase Price
                        <input
                          type="number"
                          min={0}
                          value={form.purchasePrice}
                          onChange={(event) =>
                            setForm((prev) => ({
                              ...prev,
                              purchasePrice: Number(event.target.value),
                            }))
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                        />
                      </label>
                      <label className="text-xs uppercase tracking-[0.16em] text-slate-400">
                        Down Payment
                        <input
                          type="number"
                          min={0}
                          value={form.downPayment}
                          onChange={(event) =>
                            setForm((prev) => ({
                              ...prev,
                              downPayment: Number(event.target.value),
                            }))
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                        />
                      </label>
                      <label className="text-xs uppercase tracking-[0.16em] text-slate-400">
                        Mortgage Rate
                        <input
                          type="number"
                          min={0}
                          step={0.001}
                          value={form.mortgageRate}
                          onChange={(event) =>
                            setForm((prev) => ({
                              ...prev,
                              mortgageRate: Number(event.target.value),
                            }))
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                        />
                      </label>
                      <label className="text-xs uppercase tracking-[0.16em] text-slate-400">
                        Mortgage Years
                        <input
                          type="number"
                          min={1}
                          value={form.mortgageYears}
                          onChange={(event) =>
                            setForm((prev) => ({
                              ...prev,
                              mortgageYears: Number(event.target.value),
                            }))
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                        />
                      </label>
                      <label className="text-xs uppercase tracking-[0.16em] text-slate-400">
                        Annual Rent
                        <input
                          type="number"
                          min={0}
                          value={form.annualRent}
                          onChange={(event) =>
                            setForm((prev) => ({
                              ...prev,
                              annualRent: Number(event.target.value),
                            }))
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                        />
                      </label>
                      <label className="text-xs uppercase tracking-[0.16em] text-slate-400">
                        Annual Expenses
                        <input
                          type="number"
                          min={0}
                          value={form.annualExpenses}
                          onChange={(event) =>
                            setForm((prev) => ({
                              ...prev,
                              annualExpenses: Number(event.target.value),
                            }))
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                        />
                      </label>
                    </div>

                    <div className="flex flex-wrap justify-end gap-3">
                      <motion.button
                        type="button"
                        onClick={close}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-300"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        type="submit"
                        whileHover={{ y: -2, boxShadow: "0 25px 60px -30px rgba(34,197,94,0.85)" }}
                        whileTap={{ scale: 0.97 }}
                        className="rounded-full border border-emerald-400/60 bg-emerald-400/20 px-6 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-200 shadow-[0_18px_40px_-22px_rgba(16,185,129,0.9)]"
                      >
                        Save Property
                      </motion.button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
