"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import type { FormEvent } from "react";

import { usePortfolioStore } from "../store/usePortfolio";

const defaultForm = {
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
  const [form, setForm] = useState(defaultForm);
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
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow"
      >
        Add Property
      </button>

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
            <div className="fixed inset-0 bg-slate-950/70" />
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
                <Dialog.Panel className="w-full max-w-lg transform rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-medium text-white">
                    Add a Property
                  </Dialog.Title>
                  <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="text-sm">
                        <span className="text-xs uppercase text-slate-400">Name</span>
                        <input
                          required
                          value={form.name}
                          onChange={(event) =>
                            setForm((prev) => ({ ...prev, name: event.target.value }))
                          }
                          className="mt-1 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </label>
                      <label className="text-sm">
                        <span className="text-xs uppercase text-slate-400">Purchase Price</span>
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
                          className="mt-1 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </label>
                      <label className="text-sm">
                        <span className="text-xs uppercase text-slate-400">Down Payment</span>
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
                          className="mt-1 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </label>
                      <label className="text-sm">
                        <span className="text-xs uppercase text-slate-400">Mortgage Rate</span>
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
                          className="mt-1 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </label>
                      <label className="text-sm">
                        <span className="text-xs uppercase text-slate-400">Mortgage Years</span>
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
                          className="mt-1 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </label>
                      <label className="text-sm">
                        <span className="text-xs uppercase text-slate-400">Annual Rent</span>
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
                          className="mt-1 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </label>
                      <label className="text-sm">
                        <span className="text-xs uppercase text-slate-400">Annual Expenses</span>
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
                          className="mt-1 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </label>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={close}
                        className="rounded-md border border-slate-600 px-4 py-2 text-sm text-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow"
                      >
                        Save Property
                      </button>
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
