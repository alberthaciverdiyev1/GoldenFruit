<?php

namespace App\Services;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Request;
use Illuminate\Database\Eloquent\Model;
use Maatwebsite\Excel\Facades\Excel;
use Modules\SubstitutionRegister\Excel\Imports\SubstitutionVatImport;

abstract class BaseService
{

    /**
     * Get all data
     * @return array
     */
    public function getDataAll($limit = null)
    {
        $all = $this->model->orderBy('id', 'DESC');

        if ($limit != null) {
            $all = $all->take($limit);
        }

        return $all->get();
    }

    /**
     * Get data by id
     * @param $id
     * @return array
     */
    public function getDataById($id)
    {
        $info = $this->model->find($id);

        $parameters = ['info' => $info];

        return $parameters;
    }


    /**
     * Create data
     * @return array
     */
    public function create($data)
    {
        return $this->model->create($data);
    }

    /**
     * Update data
     * @param $id
     * @param $data
     * @return array
     */
    public function update($data, int $id)
    {
        $model = $this->model->findOrFail($id);

        $model->update($data);

        return $model;
    }

    /**
     * Delete data
     * @param $id
     * @return boolean
     */
    public function delete(int $id)
    {
        $model = $this->model->findOrFail($id);
        return $model->delete();
    }

    public function importExcel($request, $class, $filters): JsonResponse
    {
        ini_set('memory_limit', '1024M');
        ini_set('max_execution_time', 300);

        $request->validate([
            'file' => 'required|file|mimes:xlsx,csv,xls',
        ]);

        try {
            $import = new $class;
            Excel::import($import, $request->file('file'));

            if ($import->failures()->isNotEmpty()) {
                return response()->json([
                    'message' => __('Import completed with some validation failures.'),
                    'failures' => $import->failures(),
                ], 422);
            }

            return response()->json([
                'message' => __('Excel imported successfully!'),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => __('Import failed:') . $e->getMessage(),
            ], 500);
        }
    }

    public function exportExcel(string $fileName, string $class, array $filters)
    {
        $export = empty($filters) ? new $class : new $class($filters);

        return Excel::download($export, "{$fileName}.xlsx");
    }

}
